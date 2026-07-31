# Configure a team policy

Store project-wide settings in `.vscode/settings.json` so contributors who open the repository receive the same choices and validation rules.

## Define types and scopes

1. Create or open `.vscode/settings.json` in the repository.
2. Add the policy your team wants to use:

```json
{
  "terradueConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" },
    { "name": "docs", "description": "Change documentation only" },
    { "name": "schema", "description": "Modify API or metadata contracts" }
  ],
  "terradueConventionalCommits.scopes": [
    "api",
    "cli",
    "docs",
    "release"
  ],
  "terradueConventionalCommits.headerMaxLength": 72,
  "terradueConventionalCommits.requireLowercaseDescription": true,
  "terradueConventionalCommits.allowFinalPeriod": false,
  "terradueConventionalCommits.inferScopesFromChangedFiles": true,
  "terradueConventionalCommits.commitAfterCompose": false
}
```

3. Commit `.vscode/settings.json` to the repository.
4. Run **Git: Compose Conventional Commit** and confirm that the type and scope lists reflect the policy.

Type names must begin with a lowercase letter and may contain lowercase letters, numbers, and hyphens. Scope values are free-form configuration values, but the validator rejects whitespace in a scope used in a message.

## Choose the configuration level

These settings are resource-scoped and can be defined at different VS Code levels:

- **User** for your personal default across projects.
- **Workspace** for all repositories in a workspace.
- **Workspace Folder** for one repository in a multi-root workspace.

More specific settings take precedence. In a multi-root workspace, use the Workspace Folder tab in Settings to give each repository its own policy.

## Control inferred scopes

With scope inference enabled, a change such as `api/routes/status.ts` offers `api`. The extension uses the first path segment of staged, unstaged, and merge changes, normalises it to lowercase, and ignores dot-prefixed directories.

Disable inference when scopes represent product concepts rather than directory names:

```json
{
  "terradueConventionalCommits.inferScopesFromChangedFiles": false
}
```

See [Settings](../reference/settings.md) for every default and constraint.

