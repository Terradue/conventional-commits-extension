# Contextual Conventional Commits

Compose consistent [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) messages without leaving VS Code.

The extension adds a guided composer to VS Code's built-in Git Source Control view. You choose the type first, and the extension then resolves the scopes that make sense for that type from repository policy. It validates the summary, records breaking changes, and writes the result into the normal commit message box. Everything runs locally.

## Start here

Choose the documentation that matches what you need:

- **Learn by doing:** complete [your first conventional commit](tutorials/first-commit.md).
- **Complete a task:** use the [how-to guides](how-to/install.md) to install, configure, or troubleshoot the extension.
- **Look something up:** consult the [commands](reference/commands.md), [settings](reference/settings.md), and [commit format](reference/commit-format.md) reference.
- **Understand the approach:** read [why Conventional Commits?](explanation/why-conventional-commits.md) and [policy and design](explanation/policy-and-design.md).

## What the extension provides

- Contextual type-to-scope selection using reusable groups and per-type rules.
- Optional or required scopes, exclusions, and control over custom scope entry for each type.
- Scope suggestions inferred from the top-level folders containing changes.
- Support for workspaces containing multiple Git repositories.
- User, workspace, and repository-folder policies through VS Code settings.
- Validation of existing messages in the Source Control input box.
- Optional immediate commit after composition.

!!! note
    The extension helps apply a configurable project policy based on Conventional Commits. Some defaults—such as a 72-character header, lowercase descriptions, and no final period—are extension policy choices, not requirements of the Conventional Commits specification.
