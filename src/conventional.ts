import type { CommitDraft, CommitPolicy } from './model';

const HEADER_PATTERN = /^(?<type>[a-z][a-z0-9-]*)(?:\((?<scope>[^()\r\n]+)\))?(?<breaking>!)?: (?<description>[^\r\n]+)$/;

export function formatCommit(draft: CommitDraft): string {
  const scope = draft.scope ? `(${draft.scope})` : '';
  const breaking = draft.breaking ? '!' : '';
  const parts = [`${draft.type}${scope}${breaking}: ${draft.description}`];

  if (draft.body?.trim()) {
    parts.push(draft.body.trim());
  }

  const footers = [...draft.footers];
  if (draft.breakingDescription?.trim()) {
    footers.unshift(`BREAKING CHANGE: ${draft.breakingDescription.trim()}`);
  }
  if (footers.length > 0) {
    parts.push(footers.join('\n'));
  }

  return parts.join('\n\n');
}

export function validateCommit(message: string, policy: CommitPolicy): readonly string[] {
  const errors: string[] = [];
  const [header = ''] = message.split(/\r?\n/, 1);
  const match = HEADER_PATTERN.exec(header);

  if (!match?.groups) {
    return ['Header must match: <type>[optional scope][!]: <description>'];
  }

  const { type, scope, description } = match.groups;
  if (!policy.types.some((item) => item.name === type)) {
    errors.push(`Unknown type "${type}".`);
  }
  if (scope && /\s/.test(scope)) {
    errors.push('Scope must not contain whitespace.');
  }
  if (header.length > policy.headerMaxLength) {
    errors.push(`Header is ${header.length} characters; maximum is ${policy.headerMaxLength}.`);
  }
  if (policy.requireLowercaseDescription && description[0] !== description[0]?.toLowerCase()) {
    errors.push('Description must begin with a lowercase character.');
  }
  if (!policy.allowFinalPeriod && description.endsWith('.')) {
    errors.push('Description must not end with a period.');
  }

  return errors;
}
