# Terradue Conventional Commits

A local, policy-driven Conventional Commits composer integrated with VS Code's built-in Git Source Control view.

## Features

- Guided type, scope, description and breaking-change workflow.
- Writes the generated message directly into the active Git SCM input box.
- Optional immediate commit through VS Code's built-in `git.commit` command.
- Supports multiple repositories in one workspace.
- Configurable types and scopes at user, workspace or repository-folder level.
- Infers scope candidates from changed top-level directories.
- Validates type, header length, description casing and final punctuation.
- Adds `BREAKING CHANGE:` and arbitrary Git-trailer-style footers.
- Operates locally and does not transmit repository contents.

## Development

```bash
npm install
npm run check
```

Open the project in VS Code and press **F5** to start an Extension Development Host.

## Package and install

```bash
npm run package
code --install-extension terradue-conventional-commits-0.1.0.vsix
```

## Usage

Open a Git repository, stage or modify files, and invoke **Git: Compose Conventional Commit** from the Command Palette or the Source Control title bar. The generated message is placed in the normal Git commit input.

## Documentation

The documentation follows the [Diátaxis](https://diataxis.fr/) structure and includes a detailed [first-commit tutorial](docs/tutorials/first-commit.md), task-oriented guides, reference material and explanation.

Build and preview it locally with:

```bash
python3 -m pip install -r requirements-docs.txt
mkdocs serve
```

## Example configuration

```json
{
  "terradueConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" },
    { "name": "schema", "description": "Modify API or metadata contracts" },
    { "name": "docs", "description": "Change documentation only" }
  ],
  "terradueConventionalCommits.scopes": [
    "openapi", "arazzo", "asyncapi", "cwl", "stac", "cli", "release"
  ],
  "terradueConventionalCommits.headerMaxLength": 72,
  "terradueConventionalCommits.inferScopesFromChangedFiles": true,
  "terradueConventionalCommits.commitAfterCompose": false
}
```

## Current limitations

The first release intentionally avoids evaluating arbitrary JavaScript-based `commitlint.config.*` files. Repository policy is expressed through VS Code resource-scoped settings, which can be committed in `.vscode/settings.json`.

## License

[![Apache License, Version 2.0](https://img.shields.io/badge/license-Apache%20License%202.0-blue)](https://www.apache.org/licenses/LICENSE-2.0)
