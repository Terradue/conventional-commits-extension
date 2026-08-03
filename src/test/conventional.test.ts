import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatCommit,
  resolveScopePolicy,
  resolveTrailerPolicy,
  validateCommit,
  validateTrailerToken
} from '../conventional';
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
  typeTrailerMatrix: {
    feat: {
      highValue: ['Refs', 'BREAKING CHANGE', 'Refs', ' Tested-by '],
      discouraged: ['Fixes referring to a causal commit']
    }
  },
  trailerDescriptions: {
    Refs: ' Related work that does not imply completion ',
    'Tested-by': 'Names a person who successfully tested the change',
    '': 'ignored',
    Empty: '   '
  },
  trailerExamples: {
    Refs: ' #123 ',
    'Tested-by': 'Alex Doe <alex@example.com>',
    '': 'ignored',
    Empty: '   '
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

test('resolves and normalizes contextual trailers for a type', () => {
  assert.deepEqual(resolveTrailerPolicy('feat', policy), {
    highValue: ['Refs', 'BREAKING CHANGE', 'Tested-by'],
    discouraged: ['Fixes referring to a causal commit'],
    descriptions: {
      Refs: 'Related work that does not imply completion',
      'Tested-by': 'Names a person who successfully tested the change'
    },
    examples: {
      Refs: '#123',
      'Tested-by': 'Alex Doe <alex@example.com>'
    }
  });
});

test('uses an empty permissive trailer policy for an unknown type', () => {
  assert.deepEqual(resolveTrailerPolicy('custom', policy), {
    highValue: [],
    discouraged: [],
    descriptions: {
      Refs: 'Related work that does not imply completion',
      'Tested-by': 'Names a person who successfully tested the change'
    },
    examples: {
      Refs: '#123',
      'Tested-by': 'Alex Doe <alex@example.com>'
    }
  });
});

test('accepts conventional custom trailer tokens', () => {
  assert.equal(validateTrailerToken(' Reviewed-by '), undefined);
  assert.equal(validateTrailerToken('CVE'), undefined);
});

test('rejects invalid and specially handled custom trailer tokens', () => {
  assert.equal(validateTrailerToken(''), 'A trailer token is required.');
  assert.equal(validateTrailerToken('Reviewed by'),
    'Use letters, numbers, and hyphens; replace spaces with hyphens.');
  assert.equal(validateTrailerToken('BREAKING CHANGE'), 'Use the dedicated breaking-change step.');
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
