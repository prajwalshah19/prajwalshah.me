import {getCliClient} from 'sanity/cli'
import {withMigration, patchDocument, type Snapshot} from './lib/migration.ts'

type Writeup = {slug: string; description: string; content: string}

const writeups: Writeup[] = [
  {
    slug: 'queuemaxxing',
    description:
      'A durable single-node HTTP queue written in Go — priority, delay, and FIFO/LIFO ordering backed by its own write-ahead log, no database required.',
    content: `# Queuemaxxing

[View on GitHub](https://github.com/prajwalshah19/queuemaxxing)

Queuemaxxing is a durable HTTP queue that runs as a single Go process and stores everything in its own checksummed, fsynced write-ahead log — no database, no external broker.

Priority always wins; FIFO or LIFO (chosen per process) breaks equal-priority ties, and every message can set an initial delivery delay. On restart, the WAL is replayed to restore messages, leases, attempts, and idempotency keys.

Also in the box: bounded exponential-backoff retries, dead letters with inspection and replay, 20-second long polling, durable lease extension, and crash-safe WAL compaction.

## Tech Stack
* **Go**`,
  },
  {
    slug: 'gitflow',
    description:
      "Trunk-based git tooling I'm building in Rust for agentic development — many agents, many small changes, one trunk.",
    content: `# gitflow

[View on GitHub](https://github.com/prajwalshah19/gitflow)

Trunk-based git tooling built for the way agents actually write code: lots of small, parallel changes that need to land on one trunk without branch ceremony. Written in Rust.

## Tech Stack
* **Rust**`,
  },
  {
    slug: 'claude-monitor',
    description:
      'A macOS menubar app in Rust that shows exactly how much RAM your Claude Code sessions are eating — per-session breakdown, kill switch included.',
    content: `# claude-monitor

[View on GitHub](https://github.com/prajwalshah19/claude-monitor)

If you run multiple Claude Code instances, they can silently eat through your RAM. claude-monitor sits in the macOS menubar and shows total Claude Code memory at a glance (e.g. \`CC 5.2G\`).

Click it for a per-session breakdown — project name, RAM, PID, age, CPU. You can kill individual sessions from the dropdown and get a notification when a session crosses your RAM threshold. It measures \`phys_footprint\`, the same metric Activity Monitor uses, so compressed memory is counted too.

## Tech Stack
* **Rust**`,
  },
  {
    slug: 'march-madness-predictor',
    description:
      "A prediction pipeline for Kaggle's March Machine Learning Mania 2026 — Elo, efficiency metrics, and live Kalshi market data turned into win probabilities for every possible matchup.",
    content: `# March Madness Predictor

[View on GitHub](https://github.com/prajwalshah19/march-madness-predictor)

A pipeline for the Kaggle March Machine Learning Mania 2026 competition that generates a win probability for every possible NCAA tournament matchup.

It blends Elo ratings, team efficiency metrics, and tournament-specific features with live prices from Kalshi prediction markets. Scored with leave-one-season-out cross-validation over 2010–2025, it currently sits at a Brier score of 0.1711.

## Tech Stack
* **Python**`,
  },
  {
    slug: 'tiny-transformer',
    description:
      'Learning ML the hard way: a tensor library, autograd engine, and eventually a distributed transformer, all from scratch in C++.',
    content: `# tiny-transformer

[View on GitHub](https://github.com/prajwalshah19/tiny-transformer)

No PyTorch, no frameworks — the point is to learn what they actually do. tiny-transformer builds the stack from the bottom: a tensor library, an autograd engine, then models, starting with linear regression and working up toward a distributed transformer.

## Tech Stack
* **C++**`,
  },
  {
    slug: 'tam-copilot',
    description:
      'An AI copilot for navigating a homeschool business, built on Palantir AIP.',
    content: `# tam-copilot

[View on GitHub](https://github.com/prajwalshah19/tam-copilot)

An AI copilot for navigating a homeschool business, built on Palantir AIP.

[Watch the demo](https://youtu.be/-F0rTVnpFcU)

## Tech Stack
* **TypeScript** + **Palantir AIP**`,
  },
]

async function main() {
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const ids = writeups.map((w) => `drafts.project-${w.slug}`)
  const documents = await client.fetch<Snapshot[]>('*[_id in $ids]', {ids})
  const mutations = writeups.map((w) => {
    const id = `drafts.project-${w.slug}`
    const document = documents.find((doc) => doc._id === id)
    if (!document || document._type !== 'project') throw new Error(`Missing project draft ${id}; refusing partial update`)
    return patchDocument(document, {
        description: [
          {
            _type: 'block',
            _key: `${w.slug}-desc`,
            style: 'normal',
            markDefs: [],
            children: [
              {_type: 'span', _key: `${w.slug}-desc-span`, text: w.description, marks: []},
            ],
          },
        ],
        content: w.content,
      })
  })
  await withMigration(client.config(), documents, mutations, process.argv.slice(2), async () => {
    await client.mutate(mutations)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
