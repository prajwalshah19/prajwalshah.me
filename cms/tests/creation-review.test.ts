import {test} from 'node:test'
import assert from 'node:assert/strict'
import * as identity from '../scripts/lib/boardIdentity.ts'
import * as migration from '../scripts/lib/migration.ts'

const doc = (_id: string, slug = 'same', _type = 'boardItem') => ({_id, _rev: `rev-${_id}`, _type, slug: {current: slug}})
const candidates = [doc('original'), doc('drafts.original')]
const review = (documents = candidates) => ({target: 'test/test', documents: documents.map(({_id, _rev}) => ({_id, _rev}))})

test('apply always requires one nonempty review path, independent of deletion count', () => {
  assert.equal(typeof migration.deletionReviewPath, 'function')
  assert.equal(migration.deletionReviewPath([]), undefined)
  assert.equal(migration.deletionReviewPath(['--review=ignored.json']), undefined)
  assert.equal(migration.deletionReviewPath(['--apply', '--review=review.json']), 'review.json')
  for (const args of [['--apply'], ['--apply', '--review='], ['--apply', '--review=a', '--review=b']]) {
    assert.throws(() => migration.deletionReviewPath(args), /review/i)
  }
  assert.throws(() => migration.validateDeletionReview(undefined, 'test/test', []), /malformed/i)
  assert.doesNotThrow(() => migration.validateDeletionReview(review([]), 'test/test', []))
})

test('review approves exact draft and published revisions separately', () => {
  assert.equal(typeof migration.validateDeletionReview, 'function')
  assert.doesNotThrow(() => migration.validateDeletionReview(review(), 'test/test', candidates))
})

test('copied allowlisted slug cannot authorize an unreviewed ID', () => {
  assert.equal(typeof migration.validateDeletionReview, 'function')
  assert.throws(() => migration.validateDeletionReview(review(), 'test/test', [...candidates, doc('copy')]), /missing/i)
})

test('review rejects stale, missing, unknown and duplicate exact IDs', () => {
  assert.equal(typeof migration.validateDeletionReview, 'function')
  for (const [documents, error] of [
    [[{_id: 'original', _rev: 'old'}, candidates[1]], /stale/i],
    [[candidates[0]], /missing/i],
    [[...candidates, doc('unknown')], /unexpected/i],
    [[...candidates, candidates[0]], /duplicate/i],
  ] as const) {
    assert.throws(() => migration.validateDeletionReview({target: 'test/test', documents: documents.map(({_id, _rev}) => ({_id, _rev}))}, 'test/test', candidates), error)
  }
})

test('review rejects malformed manifests and wrong target', () => {
  assert.equal(typeof migration.validateDeletionReview, 'function')
  for (const malformed of [null, [], {}, {target: 'test/test'}, {target: 'test/test', documents: {}}, {target: 'test/test', documents: [null]}, {target: 'test/test', documents: [{_id: 'original'}]}, {target: 'test/test', documents: [{_id: 1, _rev: 'r'}]}, {target: 'test/test', documents: [{_id: 'original', _rev: ''}]}]) {
    assert.throws(() => migration.validateDeletionReview(malformed, 'test/test', candidates), /malformed/i)
  }
  assert.throws(() => migration.validateDeletionReview({...review(), target: 'other/test'}, 'test/test', candidates), /target/i)
})

const intended = {_id: 'original', _type: 'boardItem', slug: {current: 'same'}}
test('creation accepts existing draft/published identities and skips them', () => {
  assert.equal(typeof identity.planCreations, 'function')
  for (const existing of [[candidates[0]], [candidates[1]], candidates]) {
    assert.deepEqual(identity.planCreations(existing, [intended]), [])
  }
  assert.deepEqual(identity.planCreations([], [intended]), [intended])
})

test('creation rejects same-type slug collisions, wrong-type fixed IDs and changed slugs', () => {
  assert.equal(typeof identity.planCreations, 'function')
  for (const existing of [[doc('copy')], [doc('drafts.copy')], [doc('original', 'same', 'article')], [doc('drafts.original', 'same', 'project')], [doc('original', 'changed')], [doc('drafts.original', 'changed')], [candidates[0], doc('copy')]]) {
    assert.throws(() => identity.planCreations(existing, [intended]), /identity|collision/i)
  }
  assert.deepEqual(identity.planCreations([doc('other', 'same', 'article')], [intended]), [intended])
})

test('creation preflights the whole batch, including conflicts inside the plan', () => {
  assert.equal(typeof identity.planCreations, 'function')
  assert.throws(() => identity.planCreations([], [intended, {...intended, _id: 'copy'}]), /collision/i)
  assert.throws(() => identity.planCreations([doc('copy', 'last')], [intended, {...intended, _id: 'last', slug: {current: 'last'}}]), /collision/i)
})

test('creation migration dry run performs zero fake writes', async () => {
  assert.equal(typeof identity.planCreations, 'function')
  const creates = identity.planCreations([], [intended])
  let writes = 0
  await migration.withMigration({projectId: 'test', dataset: 'test'}, [], {create: creates}, [], async () => { writes++ })
  assert.equal(writes, 0)
})
