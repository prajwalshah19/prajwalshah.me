import {test} from 'node:test'
import assert from 'node:assert/strict'
import {mkdtemp, readFile, rm} from 'node:fs/promises'
import {join} from 'node:path'
import {homedir} from 'node:os'
import {planBoardSlugs, selectBoardItem, logicalId} from '../scripts/lib/boardIdentity.ts'
import {withMigration, patchDocument, deleteDocuments} from '../scripts/lib/migration.ts'

const doc = (_id: string, title = 'Café', slug?: string) => ({_id, _rev: `rev-${_id}`, _type: 'boardItem', title, ...(slug ? {slug: {current: slug}} : {})})

test('slug allocation avoids diacritic collisions and is order independent', () => {
  const documents = [doc('b', 'Cafe'), doc('a')]
  const plan = planBoardSlugs(documents)
  assert.deepEqual(plan, planBoardSlugs([...documents].reverse()))
  assert.deepEqual(plan.map((change) => change.slug), ['cafe', 'cafe-2'])
})

test('existing slugs and draft/published identity are preserved', () => {
  const documents = [doc('a', 'Original', 'original'), doc('drafts.a', 'New title'), doc('b', 'Original')]
  assert.deepEqual(planBoardSlugs(documents).map(({document, slug}) => [document._id, slug]), [['drafts.a', 'original'], ['b', 'original-2']])
  assert.equal(logicalId('drafts.a'), 'a')
})

test('a slug object without current is backfilled and empty titles use a safe fallback', () => {
  assert.equal(planBoardSlugs([{...doc('a', '🪴'), slug: {}}])[0].slug, 'item')
})

test('existing duplicate slugs across logical documents are rejected', () => {
  assert.throws(() => planBoardSlugs([doc('a', 'A', 'same'), doc('b', 'B', 'same')]), /ambiguous/i)
})

test('conflicting draft and published slugs are not silently rewritten', () => {
  assert.throws(() => planBoardSlugs([doc('a', 'A', 'one'), doc('drafts.a', 'A', 'two')]), /conflicting/i)
})

test('single-item deletion rejects ambiguity but includes both variants of one document', () => {
  assert.throws(() => selectBoardItem([doc('a', 'A', 'same'), doc('b', 'B', 'same')], 'same'), /ambiguous/i)
  const documents = [doc('a', 'A', 'same'), doc('drafts.a', 'A', 'new-slug')]
  assert.deepEqual(selectBoardItem(documents, 'same'), documents)
  assert.deepEqual(selectBoardItem(documents, 'missing'), [])
})

test('all patches and deletions carry the snapshot revision', () => {
  const original = doc('a')
  assert.deepEqual(patchDocument(original, {title: 'New'}), {patch: {id: 'a', ifRevisionID: 'rev-a', set: {title: 'New'}}})
  assert.deepEqual(deleteDocuments([original]), [
    {patch: {id: 'a', ifRevisionID: 'rev-a', set: {title: 'Café'}}},
    {delete: {id: 'a'}},
  ])
  assert.throws(() => patchDocument({...original, _rev: ''}, {}), /revision/i)
})

test('dry runs never call the mutation callback', async () => {
  let applied = false
  await withMigration({projectId: 'test', dataset: 'test'}, [doc('a')], [], [], async () => { applied = true })
  assert.equal(applied, false)
})

test('apply requires a backup and an exact target confirmation', async () => {
  const apply = async () => { assert.fail('must not mutate') }
  const config = {projectId: 'test', dataset: 'test'}
  await assert.rejects(withMigration(config, [doc('a')], [], ['--apply'], apply), /backup/i)
  await assert.rejects(withMigration(config, [doc('a')], [], ['--apply', '--backup=unused'], apply), /target/i)
  await assert.rejects(withMigration(config, [doc('a')], [], ['--apply', '--backup=unused', '--target=wrong/test'], apply), /target/i)
})

test('backup exists before mutation and cannot be overwritten on retry', async () => {
  const dir = await mkdtemp(join(process.env.JCODE_SCRATCH_DIR || homedir(), 'cms-safety-test-'))
  const backup = join(dir, 'backup.json')
  const args = ['--apply', `--backup=${backup}`, '--target=test/test']
  let mutations = 0
  try {
    await withMigration({projectId: 'test', dataset: 'test'}, [doc('a')], [{id: 'a'}], args, async () => {
      const saved = JSON.parse(await readFile(backup, 'utf8'))
      assert.equal(saved.documents[0]._rev, 'rev-a')
      mutations++
    })
    await assert.rejects(withMigration({projectId: 'test', dataset: 'test'}, [doc('a')], [], args, async () => { mutations++ }), /EEXIST/)
    assert.equal(mutations, 1)
  } finally { await rm(dir, {recursive: true, force: true}) }
})
