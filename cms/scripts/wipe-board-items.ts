// Delete every boardItem document. Pairs with curate-in-Studio workflow:
// run this once to clear the mocks, then add real items via Sanity Studio.
//
// Dry run (default):  sanity exec scripts/wipe-board-items.ts
// Apply:              sanity exec scripts/wipe-board-items.ts -- --apply
import {getCliClient} from 'sanity/cli'

async function main() {
  const apply = process.argv.includes('--apply')
  const client = getCliClient()

  const items: {_id: string; title: string; type: string}[] = await client.fetch(
    `*[_type == "boardItem"]{_id, title, type} | order(_createdAt asc)`,
  )

  console.log(`Found ${items.length} boardItem documents:`)
  for (const it of items) console.log(`  ${it._id}  [${it.type}]  ${it.title}`)

  if (items.length === 0) return

  if (!apply) {
    console.log('\nDry run — re-run with `-- --apply` to delete all of the above.')
    return
  }

  for (const it of items) {
    await client.delete(it._id)
    console.log(`✗ deleted ${it._id}  (${it.title})`)
  }
  console.log(`\nDone. Deleted ${items.length} documents.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
