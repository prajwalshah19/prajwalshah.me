import {getCliClient} from 'sanity/cli'
import {planCreations} from './lib/boardIdentity.ts'
import {withMigration, type Snapshot} from './lib/migration.ts'

type ProjectSeed = {
  slug: string
  name: string
  link: string
  description: string
  dates: string
  date: string
  tags: string[]
  content: string
}

const projects: ProjectSeed[] = [
  {
    slug: 'queuemaxxing',
    name: 'Queuemaxxing',
    link: 'https://github.com/prajwalshah19/queuemaxxing',
    description:
      'A tiny durable single-node HTTP queue in Go with priority, delay, and process-wide FIFO/LIFO ordering — backed by its own checksummed write-ahead log, no database required.',
    dates: 'Aug 2026',
    date: '2026-08-23',
    tags: ['Go', 'Distributed Systems', 'Storage'],
    content:
      'Queuemaxxing is a durable HTTP queue that runs as one Go process and stores its own data in a local write-ahead log. Priority always wins; FIFO or LIFO breaks equal-priority ties. Every state change is appended to a checksummed WAL and fsynced, so restarts replay the log and restore messages, leases, attempts, and idempotency keys. It supports bounded exponential-backoff retries, dead letters with replay, 20-second long polling, and durable lease extension — all with no external store.',
  },
  {
    slug: 'gitflow',
    name: 'gitflow',
    link: 'https://github.com/prajwalshah19/gitflow',
    description:
      'Trunk-based git tooling for agentic development, written in Rust.',
    dates: 'Mar 2026',
    date: '2026-03-08',
    tags: ['Rust', 'Git', 'Developer Tools'],
    content:
      'gitflow is trunk-based git tooling built for workflows where AI agents produce many small branches and stacked changes. Written in Rust.',
  },
  {
    slug: 'claude-monitor',
    name: 'claude-monitor',
    link: 'https://github.com/prajwalshah19/claude-monitor',
    description:
      'A lightweight macOS menubar app in Rust that tracks memory usage across running Claude Code sessions, with per-session breakdowns and kill controls.',
    dates: 'Feb 2026',
    date: '2026-02-13',
    tags: ['Rust', 'macOS', 'Developer Tools'],
    content:
      'If you run multiple Claude Code instances, they can silently eat through your RAM. claude-monitor sits in the macOS menubar showing total Claude Code memory (e.g. "CC 5.2G"), with a per-session breakdown of project name, RAM, PID, age, and CPU. You can kill individual sessions from the dropdown and get notified when a session exceeds a RAM threshold. It measures phys_footprint — the same metric Activity Monitor uses, including compressed memory.',
  },
  {
    slug: 'march-madness-predictor',
    name: 'March Madness Predictor',
    link: 'https://github.com/prajwalshah19/march-madness-predictor',
    description:
      'A prediction pipeline for Kaggle March Machine Learning Mania 2026 combining Elo ratings, efficiency metrics, and live Kalshi prediction-market data.',
    dates: 'Mar 2026 - Apr 2026',
    date: '2026-04-15',
    tags: ['Python', 'Machine Learning', 'Sports Analytics'],
    content:
      'A prediction pipeline for the Kaggle March Machine Learning Mania 2026 competition. It combines Elo ratings, efficiency metrics, tournament-specific features, and live Kalshi prediction-market data to generate win probabilities for every possible NCAA tournament matchup. Scores 0.1711 Brier on leave-one-season-out cross-validation over 2010–2025.',
  },
  {
    slug: 'tiny-transformer',
    name: 'tiny-transformer',
    link: 'https://github.com/prajwalshah19/tiny-transformer',
    description:
      'Learning ML by building a distributed transformer from scratch in C++ — tensors, autograd, and training loops with no frameworks.',
    dates: 'Nov 2025 - Jan 2026',
    date: '2026-01-01',
    tags: ['C++', 'Machine Learning', 'From Scratch'],
    content:
      'A from-scratch ML project in C++: building up a tensor library, autograd engine, and model training (starting with linear regression) toward a distributed transformer. No frameworks — the point is to learn what they do.',
  },
  {
    slug: 'tam-copilot',
    name: 'tam-copilot',
    link: 'https://github.com/prajwalshah19/tam-copilot',
    description:
      'An AI copilot for navigating a homeschool business, powered by Palantir AIP.',
    dates: 'Apr 2025 - Jul 2025',
    date: '2025-07-29',
    tags: ['TypeScript', 'AI', 'Palantir AIP'],
    content:
      'An AI copilot for navigating a homeschool business, built on Palantir AIP. Demo: https://youtu.be/-F0rTVnpFcU',
  },
]

async function main() {
  const args = process.argv.slice(2)
  const client = getCliClient({apiVersion: '2024-01-01'}).withConfig({perspective: 'raw', useCdn: false})
  const intended = projects.map((p) => ({
      _id: `drafts.project-${p.slug}`,
      _type: 'project',
      name: p.name,
      slug: {_type: 'slug', current: p.slug},
      link: p.link,
      description: [
        {
          _type: 'block',
          _key: `${p.slug}-desc`,
          style: 'normal',
          markDefs: [],
          children: [{_type: 'span', _key: `${p.slug}-desc-span`, text: p.description, marks: []}],
        },
      ],
      dates: p.dates,
      date: p.date,
      tags: p.tags,
      content: p.content,
    }))
  const ids = projects.flatMap((p) => [`project-${p.slug}`, `drafts.project-${p.slug}`])
  const documents = await client.fetch<Snapshot[]>('*[_type == "project" || _id in $ids]', {ids})
  const creates = planCreations(documents, intended)
  const mutations = creates.map((document) => ({create: document}))
  await withMigration(client.config(), documents, {create: creates}, args, async () => {
    if (mutations.length) await client.mutate(mutations)
    console.log('Done. Review and publish in Studio.')
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
