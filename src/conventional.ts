import type {
  CommitDraft,
  CommitPolicy,
  ResolvedScopePolicy,
  ResolvedTrailerPolicy,
  TypeScopeRule
} from './model';

const HEADER_PATTERN = /^(?<type>[a-z][a-z0-9-]*)(?:\((?<scope>[^()\r\n]+)\))?(?<breaking>!)?: (?<description>[^\r\n]+)$/;

function normalize(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeRecord(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(values)
      .map(([token, value]) => [token.trim(), value.trim()])
      .filter(([token, value]) => token && value)
  );
}

export function resolveScopePolicy(type: string, policy: CommitPolicy): ResolvedScopePolicy {
  const rule: TypeScopeRule = policy.typeScopeMatrix[type] ?? {};
  const grouped = (rule.groups ?? []).flatMap((group) => policy.scopeGroups[group] ?? []);
  const excluded = normalize(rule.exclude ?? []);
  const scopes = normalize([...grouped, ...(rule.scopes ?? [])])
    .filter((scope) => !excluded.includes(scope));

  return {
    scopes,
    excluded,
    allowNone: rule.allowNone ?? true,
    allowCustom: rule.allowCustom ?? true
  };
}

export function resolveTrailerPolicy(type: string, policy: CommitPolicy): ResolvedTrailerPolicy {
  const rule = policy.typeTrailerMatrix[type] ?? {};
  return {
    highValue: normalize(rule.highValue ?? []),
    discouraged: normalize(rule.discouraged ?? []),
    descriptions: normalizeRecord(policy.trailerDescriptions),
    examples: normalizeRecord(policy.trailerExamples)
  };
}

export function validateTrailerToken(input: string): string | undefined {
  const token = input.trim();
  if (!token) return 'A trailer token is required.';
  if (token === 'BREAKING CHANGE') return 'Use the dedicated breaking-change step.';
  if (!/^[A-Za-z0-9-]+$/.test(token)) {
    return 'Use letters, numbers, and hyphens; replace spaces with hyphens.';
  }
  return undefined;
}

export function formatCommit(draft: CommitDraft): string {
  const scope = draft.scope ? `(${draft.scope})` : '';
  const breaking = draft.breaking ? '!' : '';
  const parts = [`${draft.type}${scope}${breaking}: ${draft.description}`];

  if (draft.body?.trim()) parts.push(draft.body.trim());

  const footers = [...draft.footers];
  if (draft.breakingDescription?.trim()) {
    footers.unshift(`BREAKING CHANGE: ${draft.breakingDescription.trim()}`);
  }
  if (footers.length > 0) parts.push(footers.join('\n'));

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

  const scopePolicy = resolveScopePolicy(type, policy);
  if (!scope && !scopePolicy.allowNone) {
    errors.push(`Type "${type}" requires a scope.`);
  }
  if (scope) {
    if (/\s/.test(scope)) errors.push('Scope must not contain whitespace.');
    if (scopePolicy.excluded.includes(scope)) {
      errors.push(`Scope "${scope}" is redundant or forbidden for type "${type}".`);
    } else if (!scopePolicy.allowCustom && !scopePolicy.scopes.includes(scope)) {
      errors.push(`Scope "${scope}" is not allowed for type "${type}".`);
    }
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
