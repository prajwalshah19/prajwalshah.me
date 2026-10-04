import type {Snapshot} from './migration.ts'

export function logicalId(id: string): string {
  if (id.startsWith('versions.')) throw new Error(`Release document ${id} needs separate review`)
  return id.replace(/^drafts\./, '')
}

type CreationIdentity = {_id: string; _type: string; slug: {current: string}}

// Validate the entire plan before callers perform uploads or mutations.
export function planCreations<T extends CreationIdentity>(documents: Snapshot[], intended: T[]): T[] {
  const records = [...documents, ...intended]
  for (const creation of intended) {
    const id = logicalId(creation._id)
    for (const record of records) {
      const sameId = logicalId(record._id) === id
      if (sameId && (record._type !== creation._type || record.slug?.current !== creation.slug.current)) {
        throw new Error(`Creation identity mismatch: ${record._id}`)
      }
      if (!sameId && record._type === creation._type && record.slug?.current === creation.slug.current) {
        throw new Error(`Creation slug collision: ${creation.slug.current} belongs to ${record._id}`)
      }
    }
  }
  return intended.filter((creation) => !documents.some((doc) => logicalId(doc._id) === logicalId(creation._id)))
}

export function selectBoardItem(documents: Snapshot[], slug: string): Snapshot[] {
  const ids = new Set(documents.filter((doc) => doc.slug?.current === slug).map((doc) => logicalId(doc._id)))
  if (ids.size > 1) throw new Error(`Ambiguous slug "${slug}" matches multiple documents`)
  return documents.filter((doc) => ids.has(logicalId(doc._id)))
}

export function planBoardSlugs(documents: Snapshot[]): {document: Snapshot; slug: string}[] {
  const groups = new Map<string, Snapshot[]>()
  const owners = new Map<string, string>()
  // Sort by logical identity, then prefer published title over a draft title.
  for (const doc of [...documents].sort((a, b) => logicalId(a._id).localeCompare(logicalId(b._id)) || Number(a._id.startsWith('drafts.')) - Number(b._id.startsWith('drafts.')))) {
    const id = logicalId(doc._id)
    groups.set(id, [...(groups.get(id) || []), doc])
    const slug = doc.slug?.current
    if (!slug) continue
    if (owners.has(slug) && owners.get(slug) !== id) throw new Error(`Ambiguous existing slug "${slug}"`)
    owners.set(slug, id)
  }
  const changes: {document: Snapshot; slug: string}[] = []
  for (const [id, variants] of groups) {
    const existing = [...new Set(variants.map((doc) => doc.slug?.current).filter((slug): slug is string => Boolean(slug)))]
    if (existing.length > 1) throw new Error(`Conflicting draft/published slugs for ${id}; review before backfill`)
    let slug = existing[0]
    if (!slug) {
      const base = (variants[0].title || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96) || 'item'
      slug = base
      for (let suffix = 2; owners.has(slug); suffix++) {
        const tail = `-${suffix}`
        slug = base.slice(0, 96 - tail.length) + tail
      }
      owners.set(slug, id)
    }
    for (const document of variants) {
      if (!document.slug?.current) changes.push({document, slug})
    }
  }
  return changes
}
