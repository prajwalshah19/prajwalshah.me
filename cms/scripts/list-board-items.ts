// List all boardItem documents (id, title, type, slug), drafts included. Read-only.
import {getCliClient} from 'sanity/cli'

async function main() {
  const client = getCliClient()
  const items: {_id: string; title: string; type: string; slug?: {current: string}}[] =
    await client.fetch(
      `*[_type == "boardItem" || _id in path("drafts.**") && _type == "boardItem"]{_id, title, type, slug} | order(_createdAt asc)`,
    )

  console.log(`Total: ${items.length}`)
  for (const it of items) {
    const slug = it.slug?.current ?? '(no slug)'
    console.log(`  ${it._id}  [${it.type}]  ${it.title}  → ${slug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
