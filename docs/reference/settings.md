# Settings

All settings use the `contextualConventionalCommits` namespace and can be configured at user, workspace, or workspace-folder level.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `types` | array of objects | See below | Allowed commit types and their picker descriptions. |
| `scopeGroups` | object of string arrays | See below | Reusable named scope groups referenced by type rules. |
| `typeScopeMatrix` | object of rules | See below | Contextual scope policy keyed by commit type. |
| `typeTrailerMatrix` | object of rules | See below | Contextual Git trailer suggestions and cautions keyed by commit type. |
| `inferScopesFromChangedFiles` | boolean | `true` | Prioritize top-level directories from staged, unstaged, and merge changes as scope candidates. |
| `headerMaxLength` | integer | `72` | Maximum header length; minimum configurable value is 20. |
| `requireLowercaseDescription` | boolean | `true` | Require the first description character to be lowercase. |
| `allowFinalPeriod` | boolean | `false` | Permit the description to end with a period. |
| `commitAfterCompose` | boolean | `false` | Invoke VS Code's Git commit command after normal composition. |

## Types

The default types are `feat`, `fix`, `security`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `style`, `chore`, and `revert`. Each entry has a `name` and picker `description`:

```json
{
  "contextualConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" }
  ]
}
```

Type names must match `^[a-z][a-z0-9-]*$`.

`security` is a useful project extension for vulnerability remediation and security hardening, but Conventional Commits 1.0.0 does not prescribe it or any other fixed type list. Add `security` to external tools such as commitlint when their configuration restricts allowed types.

## Scope groups

`scopeGroups` defines reusable named lists. The bundled groups are `components`, `platforms`, `build-tools`, `package-managers`, `ci-providers`, `documentation`, `test-layers`, and `security-areas`.

```json
{
  "contextualConventionalCommits.scopeGroups": {
    "components": ["api", "cli", "parser"],
    "package-managers": ["npm", "pnpm", "uv"]
  }
}
```

Configured scope values must not contain whitespace or parentheses.

## Type-to-scope matrix

`typeScopeMatrix` maps a type to its contextual scope rule. All rule fields are optional.

| Field | Type | Default when omitted | Meaning |
| --- | --- | --- | --- |
| `groups` | string array | `[]` | Names in `scopeGroups` to expand for this type. An unknown name contributes no scopes. |
| `scopes` | string array | `[]` | Additional scopes available only for this type. |
| `exclude` | string array | `[]` | Scopes removed from the resolved list and rejected during validation. |
| `allowNone` | boolean | `true` | Show **No scope** and accept an unscoped header. Set to `false` to require a scope. |
| `allowCustom` | boolean | `true` | Show **Enter custom scope…** and accept scopes outside the resolved list. |

Resolution expands `groups`, appends direct `scopes`, removes duplicate and blank values, and finally applies `exclude`. A rule that is absent or empty permits both no scope and a custom scope.

```json
{
  "contextualConventionalCommits.typeScopeMatrix": {
    "build": {
      "groups": ["package-managers"],
      "scopes": ["deps", "packaging"],
      "exclude": ["build", "ci"],
      "allowNone": false,
      "allowCustom": false
    }
  }
}
```

This rule accepts `build(npm)` and `build(deps)`, requires a scope, rejects `build(build)`, and rejects unlisted values such as `build(api)`.

## Type-to-trailer matrix

`typeTrailerMatrix` maps a type to optional guidance. It does not make trailers mandatory and does not reject a discouraged trailer, because relevance depends on the actual change.

| Field | Type | Default when omitted | Meaning |
| --- | --- | --- | --- |
| `highValue` | string array | `[]` | Trailer tokens offered in the type-specific incremental picker. |
| `discouraged` | string array | `[]` | Cautions displayed on the custom-trailer action. Entries may explain a conditional exception. |

Values are trimmed and de-duplicated. The picker remains open while the user adds recommended or custom trailers one at a time. Added trailers can be removed before finishing, and a token can be chosen repeatedly for cases such as multiple co-authors. Every trailer is emitted on its own line. `BREAKING CHANGE` is configured as high-value for `feat`, but the trailer picker omits it because the dedicated breaking-change step generates it together with the header `!` marker.

```json
{
  "contextualConventionalCommits.typeTrailerMatrix": {
    "perf": {
      "highValue": ["Benchmark", "Test-results", "Fixes", "Refs", "Reviewed-by"],
      "discouraged": ["Release-note-none, unless required by policy"]
    }
  }
}
```

An absent rule still permits custom trailers; it simply provides no recommended picker choices or cautions.

## Inferred scopes

When inference is enabled, top-level changed directories are placed before configured scopes in the picker and labelled **inferred from changed files**. Values in the selected type's `exclude` list are not offered. Inference reads staged, unstaged, and merge changes, lowercases the first path segment, replaces unsupported characters with hyphens, ignores dot-prefixed directories, sorts the result, and removes picker duplicates.

An inferred value is still subject to validation. In particular, a type with `allowCustom: false` accepts it only when the value also belongs to that type's resolved scope list.

## Complete example

```json
{
  "contextualConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "build", "description": "Change the build system or dependencies" }
  ],
  "contextualConventionalCommits.scopeGroups": {
    "components": ["api", "cli"],
    "package-managers": ["npm", "pnpm"]
  },
  "contextualConventionalCommits.typeScopeMatrix": {
    "feat": {
      "groups": ["components"],
      "exclude": ["feat", "feature"],
      "allowNone": true,
      "allowCustom": true
    },
    "build": {
      "groups": ["package-managers"],
      "scopes": ["deps"],
      "exclude": ["build"],
      "allowNone": true,
      "allowCustom": false
    }
  },
  "contextualConventionalCommits.typeTrailerMatrix": {
    "feat": {
      "highValue": ["Refs", "Implements", "Spec", "Release-note", "BREAKING CHANGE"],
      "discouraged": ["Fixes referring to a causal commit"]
    },
    "build": {
      "highValue": ["Generated-by", "Dependency", "Upstream", "Build", "Refs"],
      "discouraged": ["Co-developed-by, unless genuinely applicable"]
    }
  },
  "contextualConventionalCommits.inferScopesFromChangedFiles": true,
  "contextualConventionalCommits.headerMaxLength": 72,
  "contextualConventionalCommits.requireLowercaseDescription": true,
  "contextualConventionalCommits.allowFinalPeriod": false,
  "contextualConventionalCommits.commitAfterCompose": false
}
```
