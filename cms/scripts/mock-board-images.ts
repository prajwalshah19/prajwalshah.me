import {getCliClient} from 'sanity/cli'
import type {Mutation} from '@sanity/client'
import {selectBoardItem} from './lib/boardIdentity.ts'
import {withMigration, patchDocument, type Snapshot} from './lib/migration.ts'

// Items that should get a mock image, by slug. Picsum dimensions chosen per type.
const MOCKS: {slug: string; w: number; h: number; seed: string}[] = [
  // Books — portrait covers
  {slug: 'stoner', w: 400, h: 600, seed: 'stoner-novel'},
  {slug: 'the-pragmatic-programmer', w: 400, h: 600, seed: 'pragmatic'},
  {slug: 'the-death-of-ivan-ilyich', w: 400, h: 600, seed: 'ivan'},
  // Songs — square covers
  {slug: 'pyramid-song', w: 600, h: 600, seed: 'pyramid'},
  {slug: 'time', w: 600, h: 600, seed: 'pinkfloyd'},
  // Places — landscape
  {slug: 'tokyo-in-october', w: 800, h: 600, seed: 'tokyo-evening'},
  {slug: 'west-lafayette-in-february', w: 800, h: 600, seed: 'wabash-winter'},
  // Links — landscape
  {slug: 'patrick-collison-s-site', w: 800, h: 600, seed: 'patrick-site'},
  {slug: 'are-na', w: 800, h: 600, seed: 'arena-board'},
]

async function main() {
  const args = process.argv.slice(2)
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const documents = await client.fetch<Snapshot[]>('*[_type == "boardItem"]')
  const plan = MOCKS.flatMap((mock) => {
    const matches = selectBoardItem(documents, mock.slug)
    // Prefer the editorial draft when present; never implicitly replace its published version.
    const item = matches.find((doc) => doc._id.startsWith('drafts.')) || matches[0]
    if (!item || (item.image && !args.includes('--replace-images'))) return []
    return [{mock, item}]
  })
  await withMigration(client.config(), documents, plan.map(({mock, item}) => ({id: item._id, image: item.image, mock})), args, async () => {
    const mutations: Mutation[] = []
    for (const {mock, item} of plan) {
      const url = `https://picsum.photos/seed/${mock.seed}/${mock.w}/${mock.h}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Image download failed: ${res.status} ${url}`)
      const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), {
        filename: `${mock.slug}.jpg`, contentType: 'image/jpeg',
      })
      mutations.push(patchDocument(item, {image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}}))
    }
    // Asset uploads are not transactional. A later failure can leave unreferenced assets.
    if (mutations.length) await client.mutate(mutations)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
