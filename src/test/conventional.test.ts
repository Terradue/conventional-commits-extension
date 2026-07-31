import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCommit, validateCommit } from '../conventional';
import type { CommitPolicy } from '../model';

const policy: CommitPolicy = {
  types: [
    { name: 'feat', description: 'Feature' },
    { name: 'fix', description: 'Fix' }
  ],
  scopes: ['api'],
  headerMaxLength: 72,
  requireLowercaseDescription: true,
  allowFinalPeriod: false
};

test('formats a breaking commit with body and footer', () => {
  assert.equal(
    formatCommit({
      type: 'feat', scope: 'api', description: 'remove legacy endpoint', breaking: true,
      body: 'The v1 compatibility endpoint is no longer exposed.',
      breakingDescription: 'clients must migrate to v2', footers: ['Refs: #42']
    }),
    'feat(api)!: remove legacy endpoint\n\nThe v1 compatibility endpoint is no longer exposed.\n\nBREAKING CHANGE: clients must migrate to v2\nRefs: #42'
  );
});

test('validates a correct header', () => {
  assert.deepEqual(validateCommit('feat(api): add health endpoint', policy), []);
});

test('reports policy violations', () => {
  const errors = validateCommit('docs(api): Add health endpoint.', policy);
  assert.equal(errors.length, 3);
});
