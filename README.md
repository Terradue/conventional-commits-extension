# Contextual Conventional Commits

A generic VS Code extension that composes Conventional Commit messages through the built-in Git Source Control interface.

Unlike flat scope pickers, this extension resolves scopes **after the commit type is selected**. Repository policy can therefore allow `build(npm)` while rejecting redundant combinations such as `build(build)`.

## Features

- contextual type-to-scope selection;
- reusable named scope groups;
- explicit per-type scopes and exclusions;
- optional or required scopes per type;
- configurable custom-scope entry;
- changed-directory scope inference;
- Conventional Commit formatting and validation;
- breaking-change body and Git trailers;
- multi-repository workspace support;
- no runtime dependencies and no source-code transmission.

## Commands

- **Git: Compose Contextual Conventional Commit**
- **Git: Validate Conventional Commit**
- **Git: Compose and Commit**

## Example

Given this policy:

```json
{
  "contextualConventionalCommits.scopeGroups": {
    "build-tools": ["docker", "vite"],
    "package-managers": ["npm", "pnpm", "uv"]
  },
  "contextualConventionalCommits.typeScopeMatrix": {
    "build": {
      "groups": ["build-tools", "package-managers"],
      "scopes": ["deps", "packaging"],
      "exclude": ["build", "ci"],
      "allowNone": true,
      "allowCustom": false
    }
  }
}
```

The extension offers:

```text
build(docker)
build(vite)
build(npm)
build(pnpm)
build(uv)
build(deps)
build(packaging)
```

It rejects:

```text
build(build)
build(ci)
build(api)
```

## Configuration model

### `contextualConventionalCommits.types`

Defines the available commit types and their descriptions.

### `contextualConventionalCommits.scopeGroups`

Defines reusable named arrays of scopes:

```json
{
  "contextualConventionalCommits.scopeGroups": {
    "components": ["api", "cli", "parser", "server"],
    "platforms": ["linux", "windows", "macos"],
    "ci-providers": ["github-actions", "gitlab", "jenkins"]
  }
}
```

### `contextualConventionalCommits.typeScopeMatrix`

Maps each type to its contextual scope policy:

```json
{
  "contextualConventionalCommits.typeScopeMatrix": {
    "feat": {
      "groups": ["components"],
      "exclude": ["feat", "feature", "new"],
      "allowNone": true,
      "allowCustom": true
    },
    "ci": {
      "groups": ["ci-providers"],
      "scopes": ["lint", "release", "test"],
      "exclude": ["ci"],
      "allowNone": true,
      "allowCustom": false
    }
  }
}
```

Rule fields:

| Field | Meaning |
|---|---|
| `groups` | Named scope groups to expand |
| `scopes` | Scopes defined directly for this type |
| `exclude` | Redundant or forbidden scopes |
| `allowNone` | Whether an unscoped commit is accepted |
| `allowCustom` | Whether users may enter a scope outside the resolved list |

## Recommended semantic model

The **type** answers what kind of change occurred. The **scope** identifies which package, subsystem, component, platform, or artefact is affected.

Good examples:

```text
feat(api): add batch endpoint
fix(parser): handle escaped names
build(pnpm): update lockfile
ci(github-actions): publish release assets
docs(cli): document authentication options
```

Redundant examples rejected by the default policy:

```text
feat(feature): add export
fix(bug): handle null value
build(build): update tooling
ci(ci): adjust workflow
docs(docs): improve guide
```

See [`docs/type-scope-best-practices.md`](docs/type-scope-best-practices.md) for the consolidated matrix.

## Development

```bash
npm install
npm run check
npm run package
```

The extension requires VS Code 1.95 or newer.

## License

[![Apache License, Version 2.0](https://img.shields.io/badge/license-Apache%20License%202.0-blue)](https://www.apache.org/licenses/LICENSE-2.0)
