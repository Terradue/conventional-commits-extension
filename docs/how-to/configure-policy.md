# Configure a team policy

Store project-wide settings in `.vscode/settings.json` so contributors who open the repository receive the same contextual scope choices and validation rules.

## Define types, reusable groups, and contextual rules

1. Create or open `.vscode/settings.json` in the repository.
2. Add the policy your team wants to use:

```json
{
  "contextualConventionalCommits.types": [
    { "name": "feat", "description": "Introduce new functionality" },
    { "name": "fix", "description": "Correct defective behaviour" },
    { "name": "security", "description": "Rectify a vulnerability or strengthen security" },
    { "name": "docs", "description": "Change documentation only" },
    { "name": "build", "description": "Change the build system or dependencies" }
  ],
  "contextualConventionalCommits.scopeGroups": {
    "components": ["api", "cli", "parser"],
    "documentation": ["readme", "api", "tutorial"],
    "package-managers": ["npm", "pnpm", "uv"],
    "security-areas": ["auth", "access-control", "crypto", "secrets", "dependencies"]
  },
  "contextualConventionalCommits.typeScopeMatrix": {
    "feat": {
      "groups": ["components"],
      "exclude": ["feat", "feature"],
      "allowNone": true,
      "allowCustom": true
    },
    "fix": {
      "groups": ["components"],
      "exclude": ["fix", "bug"],
      "allowNone": true,
      "allowCustom": true
    },
    "security": {
      "groups": ["security-areas"],
      "exclude": ["security", "vulnerability", "fix", "patch", "cve"],
      "allowNone": true,
      "allowCustom": true
    },
    "docs": {
      "groups": ["components", "documentation"],
      "exclude": ["docs", "documentation"],
      "allowNone": true,
      "allowCustom": true
    },
    "build": {
      "groups": ["package-managers"],
      "scopes": ["deps", "packaging"],
      "exclude": ["build", "ci"],
      "allowNone": false,
      "allowCustom": false
    }
  },
  "contextualConventionalCommits.typeTrailerMatrix": {
    "feat": {
      "highValue": ["Refs", "Implements", "Spec", "BREAKING CHANGE"],
      "discouraged": ["Fixes referring to a causal commit"]
    },
    "fix": {
      "highValue": ["Fixes", "Closes", "Reported-by", "Tested-by"],
      "discouraged": ["Implements-blueprint"]
    },
    "security": {
      "highValue": ["CVE", "GHSA", "Security-impact", "Fixes", "Backport-to"],
      "discouraged": ["Public embargo details before disclosure"]
    }
  },
  "contextualConventionalCommits.headerMaxLength": 72,
  "contextualConventionalCommits.requireLowercaseDescription": true,
  "contextualConventionalCommits.allowFinalPeriod": false,
  "contextualConventionalCommits.inferScopesFromChangedFiles": true,
  "contextualConventionalCommits.commitAfterCompose": false
}
```

3. Commit `.vscode/settings.json` to the repository.
4. Run **Git: Compose Contextual Conventional Commit**. Choose different types and confirm that each produces the intended scope list.
5. Run **Git: Validate Conventional Commit** against a preferred and a forbidden pairing, such as `build(npm): update lockfile` and `build(build): update tooling`.

Type names must begin with a lowercase letter and may contain lowercase letters, numbers, and hyphens. Scope values must not contain whitespace or parentheses.

If the repository also uses commitlint with a restricted `type-enum`, add custom types such as `security` to that configuration as well. The extension does not read or execute `commitlint.config.*`.

## Choose how strict each type should be

Use the rule switches independently for every type:

- set `allowNone` to `false` when the type must always identify an affected area;
- set `allowCustom` to `false` when only group and direct scopes are accepted;
- add redundant or forbidden pairings to `exclude`; and
- omit either boolean to retain its permissive default of `true`.

If a type has no matrix rule, it resolves no predefined scopes but still permits **No scope** and **Enter custom scope…** by default.

## Customize trailer guidance

Use `highValue` to populate the type-specific incremental trailer picker and `discouraged` to surface cautions on the custom-trailer action. Neither field requires or forbids a trailer. An absent trailer rule simply leaves no recommended tokens while retaining custom entry.

Keep caution text explanatory when a trailer has legitimate exceptions, for example `"Tested-by, except for documentation builds"`. For security fixes under embargo, do not encode private vulnerability details in a public commit message.

## Choose the configuration level

These settings are resource-scoped and can be defined at different VS Code levels:

- **User** for your personal default across projects.
- **Workspace** for all repositories in a workspace.
- **Workspace Folder** for one repository in a multi-root workspace.

More specific settings take precedence. In a multi-root workspace, use the Workspace Folder tab in Settings to give each repository its own policy.

## Control inferred scopes

With scope inference enabled, a change such as `api/routes/status.ts` offers `api` before the configured choices, unless `api` is excluded for the selected type. The extension considers staged, unstaged, and merge changes.

With `allowCustom: false`, make sure any inferred directory you want accepted is also present in a referenced group or in the type's direct `scopes`. Validation still applies the closed list.

Disable inference when scopes represent product concepts rather than directory names:

```json
{
  "contextualConventionalCommits.inferScopesFromChangedFiles": false
}
```

See [Settings](../reference/settings.md) for every default and constraint, and [type-to-scope best practices](../type-scope-best-practices.md) for policy examples.
