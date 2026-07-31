# Validate and troubleshoot a message

## Validate an existing message

1. Open **Source Control**.
2. Enter or paste a message into the commit message box.
3. Run **Git: Validate Conventional Commit** from the Command Palette, or select **Validate Conventional Commit** beside the commit box.
4. Correct each error shown by VS Code and validate again.

Validation checks the header format, configured type, scope whitespace, header length, description casing, and final punctuation. See [Commit format](../reference/commit-format.md) for the exact rules.

## Fix common errors

### No Git repository is open

Open a folder that contains a `.git` repository, or initialise one with VS Code's **Initialize Repository** action. The extension relies on VS Code's built-in Git extension.

### The built-in Git extension is unavailable

Open **Extensions**, search for `@builtin git`, and make sure **Git** is enabled. Also confirm that Git is installed and available to VS Code.

### Unknown type

Choose one of the configured types, or add the required type to `terradueConventionalCommits.types` at the appropriate settings level.

### Scope must not contain whitespace

Use a compact scope such as `public-api` instead of `public api`.

### Description casing or punctuation is rejected

The default project policy requires a lowercase first character and disallows a final period. Rewrite the description or change the corresponding [settings](../reference/settings.md).

### The header is too long

Shorten the description or scope. Put supporting detail in the body instead of increasing the limit unless the project has deliberately chosen a different convention.

### The wrong repository is selected

In a multi-repository workspace, rerun the command and select the repository containing the intended changes. Settings and inferred scopes are resolved for that selected repository.

### Composition commits immediately

Set `terradueConventionalCommits.commitAfterCompose` to `false`, or use **Git: Compose Conventional Commit** rather than **Git: Compose and Commit**. The latter always invokes VS Code's Git commit command after composing.

