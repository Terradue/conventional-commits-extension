# Settings

All settings use the `terradueConventionalCommits` namespace and can be configured at user, workspace, or workspace-folder level.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `types` | array of objects | See below | Allowed commit types and their picker descriptions. |
| `scopes` | array of strings | See below | Scope choices appended to inferred scopes. |
| `inferScopesFromChangedFiles` | boolean | `true` | Suggest top-level directories from staged, unstaged, and merge changes. |
| `headerMaxLength` | integer | `72` | Maximum header length; minimum configurable value is 20. |
| `requireLowercaseDescription` | boolean | `true` | Require the first description character to be lowercase. |
| `allowFinalPeriod` | boolean | `false` | Permit the description to end with a period. |
| `commitAfterCompose` | boolean | `false` | Invoke VS Code's Git commit command after normal composition. |

## Default types

| Type | Picker description |
| --- | --- |
| `feat` | Introduce new functionality |
| `fix` | Correct defective behaviour |
| `docs` | Change documentation only |
| `style` | Change formatting without behavioural changes |
| `refactor` | Restructure code without changing behaviour |
| `perf` | Improve performance |
| `test` | Add or correct tests |
| `build` | Change build system or dependencies |
| `ci` | Change continuous integration configuration |
| `chore` | Perform repository maintenance |
| `revert` | Revert a previous commit |

Type names must match `^[a-z][a-z0-9-]*$`. Each object requires both `name` and `description`.

## Default scopes

```text
api, openapi, arazzo, asyncapi, cwl, stac, cli, docs, build, release
```

The scope picker removes duplicates when an inferred scope also appears in this list. Selecting **No scope** omits the parenthesised scope from the header.

## Complete example

```json
{
  "terradueConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" }
  ],
  "terradueConventionalCommits.scopes": ["api", "cli"],
  "terradueConventionalCommits.inferScopesFromChangedFiles": true,
  "terradueConventionalCommits.headerMaxLength": 72,
  "terradueConventionalCommits.requireLowercaseDescription": true,
  "terradueConventionalCommits.allowFinalPeriod": false,
  "terradueConventionalCommits.commitAfterCompose": false
}
```

