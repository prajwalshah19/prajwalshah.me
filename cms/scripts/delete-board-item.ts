// Dry-run by default. See ../README.md for apply, backup and target flags.
import {getCliClient} from 'sanity/cli'
import {selectBoardItem} from './lib/boardIdentity.ts'
import {withMigration, deleteDocuments, type Snapshot} from './lib/migration.ts'

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const slug = args.find((arg) => !arg.startsWith('--'))
  if (!slug) throw new Error('Usage: sanity exec scripts/delete-board-item.ts --with-user-token -- <slug> [apply flags]')
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const documents = await client.fetch<Snapshot[]>('*[_type == "boardItem"]')
  const matches = selectBoardItem(documents, slug)
  const mutations = deleteDocuments(matches)
  await withMigration(client.config(), matches, {slug, delete: matches.map((doc) => doc._id)}, args, async () => {
    if (mutations.length) await client.mutate(mutations)
  })
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
