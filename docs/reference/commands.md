# Commands

All commands are available from the VS Code Command Palette.

| Display name | Command ID | Behavior |
| --- | --- | --- |
| **Git: Compose Conventional Commit** | `terradueConventionalCommits.compose` | Opens the guided composer and writes the result to the selected repository's Source Control input box. Commits too when `commitAfterCompose` is enabled. |
| **Git: Validate Conventional Commit** | `terradueConventionalCommits.validate` | Validates the message already present in the Source Control input box. |
| **Git: Compose and Commit** | `terradueConventionalCommits.commit` | Opens the composer, writes the message, and invokes VS Code's built-in `git.commit` command. |

## Source Control menus

When the active Source Control provider is Git:

- **Compose Conventional Commit** appears in the Source Control title bar and the commit input toolbar.
- **Validate Conventional Commit** appears in the commit input toolbar.

## Repository selection

- With no open repository, the extension displays a warning.
- With one repository, it is selected automatically.
- With multiple repositories, the extension prompts for one before composing or validating.

The selected repository determines the Source Control input box, inferred scopes, and resource-scoped settings used by the command.

