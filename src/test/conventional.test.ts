import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCommit, resolveScopePolicy, validateCommit } from '../conventional';
import type { CommitPolicy } from '../model';

const policy: CommitPolicy = {
  types: [
    { name: 'feat', description: 'Feature' },
    { name: 'build', description: 'Build' }
  ],
  scopeGroups: {
    components: ['api', 'parser'],
    tools: ['npm', 'docker']
  },
  typeScopeMatrix: {
    feat: { groups: ['components'], exclude: ['feat'], allowNone: true, allowCustom: true },
    build: { groups: ['tools'], exclude: ['build'], allowNone: true, allowCustom: false }
  },
  headerMaxLength: 72,
  requireLowercaseDescription: true,
  allowFinalPeriod: false
};

test('formats a complete breaking commit', () => {
  assert.equal(formatCommit({
    type: 'feat', scope: 'api', description: 'add batch endpoint', breaking: true,
    body: 'Supports multiple jobs.', breakingDescription: 'clients must accept arrays', footers: ['Refs: #12']
  }), 'feat(api)!: add batch endpoint\n\nSupports multiple jobs.\n\nBREAKING CHANGE: clients must accept arrays\nRefs: #12');
});

test('resolves reusable scope groups for a type', () => {
  assert.deepEqual(resolveScopePolicy('build', policy), {
    scopes: ['npm', 'docker'], excluded: ['build'], allowNone: true, allowCustom: false
  });
});

test('rejects redundant type-scope pairs', () => {
  assert.deepEqual(validateCommit('build(build): update tooling', policy), [
    'Scope "build" is redundant or forbidden for type "build".'
  ]);
});

test('rejects non-allowed custom scope when disabled', () => {
  assert.deepEqual(validateCommit('build(api): update tooling', policy), [
    'Scope "api" is not allowed for type "build".'
  ]);
});

test('accepts a compatible matrix pair', () => {
  assert.deepEqual(validateCommit('build(npm): update lockfile', policy), []);
});
