# Settings

All settings use the `contextualConventionalCommits` namespace and can be configured at user, workspace, or workspace-folder level.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `types` | array of objects | See below | Allowed commit types and their picker descriptions. |
| `scopeGroups` | object of string arrays | See below | Reusable named scope groups referenced by type rules. |
| `typeScopeMatrix` | object of rules | See below | Contextual scope policy keyed by commit type. |
| `typeTrailerMatrix` | object of rules | See below | Contextual Git trailer suggestions and cautions keyed by commit type. |
| `trailerDescriptions` | object of strings | See below | Meanings shown beside trailer choices and in their value prompts. |
| `trailerExamples` | object of strings | See below | Contextual example values shown after selecting a trailer token. |
| `inferScopesFromChangedFiles` | boolean | `true` | Prioritize top-level directories from staged, unstaged, and merge changes as scope candidates. |
| `headerMaxLength` | integer | `72` | Maximum header length; minimum configurable value is 20. |
| `requireLowercaseDescription` | boolean | `true` | Require the first description character to be lowercase. |
| `allowFinalPeriod` | boolean | `false` | Permit the description to end with a period. |
| `commitAfterCompose` | boolean | `false` | Invoke VS Code's Git commit command after normal composition. |

## Types

The alphabetized default types are `a11y`, `api`, `build`, `chore`, `ci`, `config`, `data`, `deps`, `docs`, `feat`, `fix`, `i18n`, `infra`, `legal`, `meta`, `perf`, `refactor`, `release`, `revert`, `schema`, `security`, `style`, `test`, and `ux`. Each entry has a `name` and picker `description`:

```json
{
  "contextualConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" }
  ]
}
```

Type names must match `^[a-z][a-z0-9-]*$`.

Conventional Commits 1.0.0 gives standard release meaning to `feat` and `fix` but does not prescribe a closed type list. The broader defaults synthesize Angular, Vue, commitlint, semantic-release, Release Please, Conventional Changelog, Atom, and common monorepo and domain practices. Types such as `a11y`, `api`, `config`, `data`, `deps`, `i18n`, `infra`, `legal`, `meta`, `release`, `schema`, `security`, and `ux` are ecosystem or project extensions. Add the extensions retained by a project to tools such as commitlint when their configuration restricts allowed types. See [Conventional Commit type-to-scope best practices](../type-scope-best-practices.md#sources-of-the-default-type-vocabulary) for the source-by-source mapping and usage guidance.

## Scope groups

`scopeGroups` defines reusable named lists. The bundled groups are `build-tools`, `ci-providers`, `components`, `documentation`, `package-managers`, `platforms`, `security-areas`, and `test-layers`.

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

## Trailer descriptions

`trailerDescriptions` maps an exact trailer token to the concise meaning displayed beside it in the picker. The description is also included in the value prompt after selection. Unknown tokens fall back to **Project-defined trailer recommended for _type_**.

```json
{
  "contextualConventionalCommits.trailerDescriptions": {
    "Refs": "Related issue, ticket, commit, or document; does not imply completion",
    "Tested-by": "Person who successfully tested the change; use Name <email>",
    "Runbook": "Operational procedure affected by the change"
  }
}
```

Git standardizes how trailers are parsed, but not a universal token vocabulary. The bundled descriptions summarize established community conventions where they exist and give neutral project-policy meanings to generic tokens. Override them when a repository's automation assigns different semantics.

## Trailer examples

`trailerExamples` maps an exact trailer token to the example displayed in its value box. The example is a placeholder and is not inserted into the commit. Unknown tokens fall back to **Enter a project-specific value for _token_**.

```json
{
  "contextualConventionalCommits.trailerExamples": {
    "Refs": "#123",
    "Tested-by": "Alex Doe <alex@example.com>",
    "Runbook": "docs/runbooks/batch-worker.md"
  }
}
```

Examples should contain only the value because the selected token is already shown in the input title and prompt. Override bundled examples when a repository uses a different identifier or automation convention.

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
