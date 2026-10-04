import {getCliClient} from 'sanity/cli'
import {planBoardSlugs} from './lib/boardIdentity.ts'
import {withMigration, patchDocument, type Snapshot} from './lib/migration.ts'

async function main() {
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const documents = await client.fetch<Snapshot[]>('*[_type == "boardItem"]')
  const changes = planBoardSlugs(documents)
  const mutations = changes.map(({document, slug}) => patchDocument(document, {slug: {_type: 'slug', current: slug}}))
  await withMigration(client.config(), documents, mutations, process.argv.slice(2), async () => {
    if (mutations.length) await client.mutate(mutations)
  })
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
