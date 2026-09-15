// Replace the reviewed Board mocks and announce the requested article.
// Dry run: sanity exec scripts/curate-portfolio-20260915.ts --with-user-token
// Apply: append -- --apply --assets=/path/to/images --backup=/path/to/backup.json
import {readFile, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'
import type {SanityDocument} from '@sanity/client'

const mockSlugs = new Set([
  'stoner', 'talk-is-cheap-show-me-the-code', 'why-i-switched-to-sanity',
  'patrick-collison-s-site', 'the-death-of-ivan-ilyich', 'currently-obsessed-with',
  'pyramid-song', 'the-map-is-not-the-territory', 'on-building-in-public',
  'premature-optimization-is-the-root-of-all-evil', 'tokyo-in-october',
  'the-pragmatic-programmer', 'west-lafayette-in-february', 'time', 'are-na',
])

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
  const apply = args.includes('--apply')
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw'})
  const documents = await client.fetch<SanityDocument[]>(
    '*[_type in ["boardItem", "article"]]',
  )
  const board = documents.filter((doc) => doc._type === 'boardItem')
  const obsolete = board.filter((doc) => !pins.some((pin) => pin.id === doc._id))
  for (const doc of obsolete) {
    const slug = (doc.slug as {current?: string} | undefined)?.current
    if (!slug || !mockSlugs.has(slug)) {
      throw new Error(`Unreviewed Board item: ${doc._id}; inspect before deleting`)
    }
  }
  console.log(JSON.stringify({
    remove: obsolete.map((doc) => ({id: doc._id, title: doc.title})),
    keep: pins.map((pin) => pin.title),
    writing: 'But what about the consumer? — Coming soon',
  }, null, 2))
  if (!apply) return

  const assets = args.find((arg) => arg.startsWith('--assets='))?.slice(9)
  const backup = args.find((arg) => arg.startsWith('--backup='))?.slice(9)
  if (!assets || !backup) throw new Error('--assets and --backup are required')
  // Exclusive creation prevents replacing a previous backup during a retry.
  await writeFile(backup, JSON.stringify(documents, null, 2), {flag: 'wx', mode: 0o600})
  console.log(`Backup saved: ${backup}`)

  let transaction = client.transaction()
  for (const doc of obsolete) {
    // Fail the whole transaction if a document changed after the backup.
    transaction = transaction
      .patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({title: doc.title}))
      .delete(doc._id)
  }
  for (const pin of pins) {
    if (board.some((doc) => doc._id === pin.id)) continue
    const image = await client.assets.upload('image', await readFile(join(assets, pin.filename)), {
      filename: pin.filename,
      contentType: 'image/jpeg',
      creditLine: pin.credit,
      source: {id: pin.imageUrl, name: pin.credit, url: pin.source},
    })
    transaction = transaction.createIfNotExists({
      _id: pin.id,
      _type: 'boardItem',
      title: pin.title,
      type: pin.type,
      ...(pin.creator ? {creator: pin.creator} : {}),
      slug: {_type: 'slug', current: pin.slug},
      date: '2026-09-15',
      featured: false,
      image: {_type: 'image', asset: {_type: 'reference', _ref: image._id}},
    })
  }
  transaction = transaction.createIfNotExists({
    _id: 'article-but-what-about-the-consumer',
    _type: 'article',
    title: 'But what about the consumer?',
    slug: {_type: 'slug', current: 'but-what-about-the-consumer'},
    comingSoon: true,
  })
  await transaction.commit()
  console.log('Applied Board and Writing curation.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
