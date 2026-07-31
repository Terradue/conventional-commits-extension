# Settings

All settings use the `contextualConventionalCommits` namespace and can be configured at user, workspace, or workspace-folder level.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `types` | array of objects | See below | Allowed commit types and their picker descriptions. |
| `scopeGroups` | object of string arrays | See below | Reusable named scope groups referenced by type rules. |
| `typeScopeMatrix` | object of rules | See below | Contextual scope policy keyed by commit type. |
| `inferScopesFromChangedFiles` | boolean | `true` | Prioritize top-level directories from staged, unstaged, and merge changes as scope candidates. |
| `headerMaxLength` | integer | `72` | Maximum header length; minimum configurable value is 20. |
| `requireLowercaseDescription` | boolean | `true` | Require the first description character to be lowercase. |
| `allowFinalPeriod` | boolean | `false` | Permit the description to end with a period. |
| `commitAfterCompose` | boolean | `false` | Invoke VS Code's Git commit command after normal composition. |

## Types

The default types are `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `style`, `chore`, and `revert`. Each entry has a `name` and picker `description`:

```json
{
  "contextualConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" }
  ]
}
```

Type names must match `^[a-z][a-z0-9-]*$`.

## Scope groups

`scopeGroups` defines reusable named lists. The bundled groups are `components`, `platforms`, `build-tools`, `package-managers`, `ci-providers`, `documentation`, and `test-layers`.

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
  "contextualConventionalCommits.inferScopesFromChangedFiles": true,
  "contextualConventionalCommits.headerMaxLength": 72,
  "contextualConventionalCommits.requireLowercaseDescription": true,
  "contextualConventionalCommits.allowFinalPeriod": false,
  "contextualConventionalCommits.commitAfterCompose": false
}
```
