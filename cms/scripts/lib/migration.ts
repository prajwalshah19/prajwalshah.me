import {writeFile} from 'node:fs/promises'
import type {Mutation} from '@sanity/client'

export interface Snapshot {
  _id: string
  _rev: string
  _type: string
  title?: string
  slug?: {current?: string}
  [key: string]: unknown
}

type Target = {projectId?: string; dataset?: string}

export function deletionReviewPath(args: string[]): string | undefined {
  if (!args.includes('--apply')) return undefined
  const reviews = args.filter((arg) => arg.startsWith('--review='))
  if (reviews.length !== 1 || !reviews[0].slice(9).trim()) throw new Error('Exactly one --review=<file> is required to apply')
  return reviews[0].slice(9)
}

export function validateDeletionReview(review: unknown, target: string, candidates: Snapshot[]): void {
  if (!review || typeof review !== 'object' || Array.isArray(review)) throw new Error('Malformed review manifest')
  const manifest = review as Record<string, unknown>
  if (typeof manifest.target !== 'string' || !Array.isArray(manifest.documents)) throw new Error('Malformed review manifest')
  if (manifest.target !== target) throw new Error(`Review target must be ${target}`)
  const expected = new Map(candidates.map((doc) => [doc._id, doc._rev]))
  const seen = new Set<string>()
  for (const entry of manifest.documents) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry) ||
        typeof entry._id !== 'string' || !entry._id.trim() ||
        typeof entry._rev !== 'string' || !entry._rev.trim()) throw new Error('Malformed review document')
    if (seen.has(entry._id)) throw new Error(`Duplicate review ID: ${entry._id}`)
    seen.add(entry._id)
    if (!expected.has(entry._id)) throw new Error(`Unexpected review ID: ${entry._id}`)
    if (expected.get(entry._id) !== entry._rev) throw new Error(`Stale review revision: ${entry._id}`)
  }
  for (const id of expected.keys()) {
    if (!seen.has(id)) throw new Error(`Missing review ID: ${id}`)
  }
}

export async function withMigration(
  config: Target,
  documents: Snapshot[],
  plan: unknown,
  args: string[],
  apply: () => Promise<void>,
): Promise<void> {
  const target = `${config.projectId}/${config.dataset}`
  if (!config.projectId || !config.dataset) throw new Error('Missing project/dataset configuration')
  console.log(JSON.stringify({target, documents: documents.map(({_id, _rev}) => ({_id, _rev})), plan}, null, 2))
  if (!args.includes('--apply')) {
    console.log('Dry run. Review the plan before applying with --apply --backup=<new-file> --target=' + target)
    return
  }
  const backup = args.find((arg) => arg.startsWith('--backup='))?.slice(9)
  if (!backup) throw new Error('--backup=<new-file> is required to apply')
  if (!args.includes(`--target=${target}`)) throw new Error(`Confirm the exact target with --target=${target}`)
  // Do not serialize the client configuration: it may contain a token.
  await writeFile(backup, JSON.stringify({target, documents, plan}, null, 2), {flag: 'wx', mode: 0o600})
  console.log(`Backup saved: ${backup}`)
  await apply()
}

export function patchDocument(document: Snapshot, set: Record<string, unknown>): Mutation {
  if (!document._rev) throw new Error(`Missing revision for ${document._id}`)
  return {patch: {id: document._id, ifRevisionID: document._rev, set}}
}

export function deleteDocuments(documents: Snapshot[]): Mutation[] {
  // The revision-checked no-op patch and delete MUST be sent in one transaction.
  return documents.flatMap((document) => [
    patchDocument(document, {title: document.title ?? ''}),
    {delete: {id: document._id}},
  ])
}
