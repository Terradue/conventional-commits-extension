import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

interface ConfigurationProperty {
  readonly default?: unknown;
}

interface PackageManifest {
  readonly contributes: {
    readonly configuration: {
      readonly properties: Readonly<Record<string, ConfigurationProperty>>;
    };
  };
}

interface ConfiguredType {
  readonly name: string;
  readonly description: string;
}

const manifest = JSON.parse(readFileSync('package.json', 'utf8')) as PackageManifest;
const properties = manifest.contributes.configuration.properties;

function defaultValue<T>(name: string): T {
  const property = properties[`contextualConventionalCommits.${name}`];
  assert.ok(property, `Missing configuration property: ${name}`);
  assert.notEqual(property.default, undefined, `Missing default value: ${name}`);
  return property.default as T;
}

function assertStringArraysSorted(value: unknown): void {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'string')) {
      assert.deepEqual(value, [...value].sort());
    } else {
      value.forEach(assertStringArraysSorted);
    }
    return;
  }

  if (value !== null && typeof value === 'object') {
    Object.values(value as Readonly<Record<string, unknown>>).forEach(assertStringArraysSorted);
  }
}

function assertObjectKeysSorted(value: Readonly<Record<string, unknown>>): void {
  assert.deepEqual(Object.keys(value), Object.keys(value).sort());
}

const expectedTypes = [
  'a11y', 'api', 'build', 'chore', 'ci', 'config', 'data', 'deps', 'docs', 'feat', 'fix', 'i18n',
  'infra', 'legal', 'meta', 'perf', 'refactor', 'release', 'revert', 'schema', 'security', 'style',
  'test', 'ux'
];

test('ships the synthesized default types in ascending order', () => {
  const types = defaultValue<readonly ConfiguredType[]>('types');
  assert.deepEqual(types.map(({ name }) => name), expectedTypes);
  assert.ok(types.every(({ description }) => description.trim().length > 0));
});

test('defines scope and trailer guidance for every default type', () => {
  const scopeMatrix = defaultValue<Readonly<Record<string, unknown>>>('typeScopeMatrix');
  const trailerMatrix = defaultValue<Readonly<Record<string, unknown>>>('typeTrailerMatrix');
  assert.deepEqual(Object.keys(scopeMatrix), expectedTypes);
  assert.deepEqual(Object.keys(trailerMatrix), expectedTypes);
});

test('sorts bundled policy lists in ascending order', () => {
  assertStringArraysSorted(defaultValue('scopeGroups'));
  assertStringArraysSorted(defaultValue('typeScopeMatrix'));
  assertStringArraysSorted(defaultValue('typeTrailerMatrix'));
});

test('sorts every map-like configuration default in ascending order', () => {
  assertObjectKeysSorted(defaultValue<Readonly<Record<string, unknown>>>('scopeGroups'));
  assertObjectKeysSorted(defaultValue<Readonly<Record<string, unknown>>>('trailerDescriptions'));
  assertObjectKeysSorted(defaultValue<Readonly<Record<string, unknown>>>('trailerExamples'));
  assertObjectKeysSorted(defaultValue<Readonly<Record<string, unknown>>>('typeScopeMatrix'));
  assertObjectKeysSorted(defaultValue<Readonly<Record<string, unknown>>>('typeTrailerMatrix'));
});
