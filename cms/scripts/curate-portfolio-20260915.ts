// Replace the reviewed Board mocks and announce the requested article.
// Dry run: sanity exec scripts/curate-portfolio-20260915.ts --with-user-token
// Apply: append -- --apply --review=/path/to/review.json --assets=/path/to/images
//   --backup=/path/to/new-backup.json --target=<project>/<dataset>
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'
import type {Mutation} from '@sanity/client'
import {logicalId, planCreations} from './lib/boardIdentity.ts'
import {withMigration, deleteDocuments, deletionReviewPath, validateDeletionReview, type Snapshot} from './lib/migration.ts'

const pins = [
  {
    id: 'board-the-inner-game-of-tennis',
    slug: 'the-inner-game-of-tennis',
    title: 'The Inner Game of Tennis',
    type: 'book',
    creator: 'W. Timothy Gallwey',
    filename: 'the-inner-game-of-tennis.jpg',
    credit: 'Penguin Random House',
    source: 'https://www.penguinrandomhouse.com/books/57757/the-inner-game-of-tennis-50th-anniversary-edition-by-w-timothy-gallwey/',
    imageUrl: 'https://images2.penguinrandomhouse.com/cover/9780593732038',
  },
  {
    id: 'board-porsche-911-gt3-rs',
    slug: 'porsche-911-gt3-rs',
    title: 'Porsche 911 GT3 RS',
    type: 'photo',
    creator: undefined,
    filename: 'porsche-911-gt3-rs.jpg',
    credit: 'Porsche AG',
    source: 'https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html',
    imageUrl: 'https://newsroom.porsche.com/.imaging/mte/porsche-templating-theme/teaser_700x395/dam/pnr/2022/Products/911-GT3-RS-Premiere/_BKOS6959_edit_V02_highres.jpeg/jcr:content/_BKOS6959_edit_V02_highres.jpeg',
  },
]

async function main() {
  const args = process.argv.slice(2)
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const article = {
    _id: 'article-but-what-about-the-consumer',
    _type: 'article',
    title: 'But what about the consumer?',
    slug: {_type: 'slug', current: 'but-what-about-the-consumer'},
    comingSoon: true,
  }
  const identities = [...pins.map((pin) => ({_id: pin.id, _type: 'boardItem', slug: {current: pin.slug}})), article]
  const ids = identities.flatMap(({_id}) => [_id, `drafts.${_id}`])
  const documents = await client.fetch<Snapshot[]>(
    '*[_type in ["boardItem", "article"] || _id in $ids]', {ids},
  )
  const creates = planCreations(documents, identities)
  const board = documents.filter((doc) => doc._type === 'boardItem')
  const obsolete = board.filter((doc) => !pins.some((pin) => pin.id === logicalId(doc._id)))
  const plan = {
    remove: obsolete.map((doc) => ({_id: doc._id, _rev: doc._rev, title: doc.title})),
    create: creates,
    keep: pins.map((pin) => pin.title),
    writing: 'But what about the consumer? — Coming soon',
  }
  const reviewPath = deletionReviewPath(args)
  if (reviewPath) {
    const review: unknown = JSON.parse(await readFile(reviewPath, 'utf8'))
    const config = client.config()
    validateDeletionReview(review, `${config.projectId}/${config.dataset}`, obsolete)
  }
  await withMigration(client.config(), documents, plan, args, async () => {
  const assets = args.find((arg) => arg.startsWith('--assets='))?.slice(9)
  if (!assets) throw new Error('--assets is required')
  const mutations: Mutation[] = deleteDocuments(obsolete)
  for (const pin of pins) {
    if (!creates.some((doc) => doc._id === pin.id)) continue
    const image = await client.assets.upload('image', await readFile(join(assets, pin.filename)), {
      filename: pin.filename,
      contentType: 'image/jpeg',
      creditLine: pin.credit,
      source: {id: pin.imageUrl, name: pin.credit, url: pin.source},
    })
    mutations.push({create: {
      _id: pin.id,
      _type: 'boardItem',
      title: pin.title,
      type: pin.type,
      ...(pin.creator ? {creator: pin.creator} : {}),
      slug: {_type: 'slug', current: pin.slug},
      date: '2026-09-15',
      featured: false,
      image: {_type: 'image', asset: {_type: 'reference', _ref: image._id}},
    }})
  }
  if (creates.some((doc) => doc._id === article._id)) mutations.push({create: article})
  if (mutations.length) await client.mutate(mutations)
  console.log('Applied Board and Writing curation.')
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
