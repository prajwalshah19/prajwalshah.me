// Dry-run by default. Deletes both draft and published variants after explicit approval.
import {getCliClient} from 'sanity/cli'
import {withMigration, deleteDocuments, type Snapshot} from './lib/migration.ts'

async function main() {
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const documents = await client.fetch<Snapshot[]>('*[_type == "boardItem"]')
  const mutations = deleteDocuments(documents)
  await withMigration(client.config(), documents, {delete: documents.map((doc) => doc._id)}, process.argv.slice(2), async () => {
    if (mutations.length) await client.mutate(mutations)
  })
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
