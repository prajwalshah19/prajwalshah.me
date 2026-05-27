// Delete a single boardItem document by slug.
//
// Dry run (default):  sanity exec scripts/delete-board-item.ts -- <slug>
// Apply:              sanity exec scripts/delete-board-item.ts -- <slug> --apply
import {getCliClient} from 'sanity/cli'

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  const apply = args.includes('--apply')
  const slug = args.find((a) => a !== '--apply')

  if (!slug) {
    console.error('Usage: sanity exec scripts/delete-board-item.ts -- <slug> [--apply]')
    process.exit(1)
  }

  const client = getCliClient()
  const matches: {_id: string; title: string; slug?: {current: string}}[] = await client.fetch(
    `*[_type == "boardItem" && slug.current == $slug]{_id, title, slug}`,
    {slug},
  )

  if (matches.length === 0) {
    console.log(`No boardItem found with slug "${slug}".`)
    return
  }

  console.log(`Matches for slug "${slug}":`)
  for (const m of matches) console.log(`  ${m._id}  (${m.title})`)

  if (!apply) {
    console.log('\nDry run — re-run with --apply to delete.')
    return
  }

  for (const m of matches) {
    await client.delete(m._id)
    console.log(`✗ deleted ${m._id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
