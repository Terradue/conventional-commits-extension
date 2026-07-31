# Policy and design

Terradue Conventional Commits is a thin interaction layer over VS Code's built-in Git support. Its design keeps composition close to the place where developers already inspect and commit changes.

## Local and repository-aware

The extension obtains repositories from VS Code's built-in Git extension. It reads their changed-file paths to suggest scopes and writes the finished message into the selected repository's normal Source Control input box.

No repository contents or commit messages are sent to an external service. Scope inference uses local paths only.

## Policy belongs with the resource

VS Code settings can apply to a user, workspace, or individual workspace folder. The extension resolves policy against the selected repository, which gives a multi-root workspace the right configuration for each project.

This makes `.vscode/settings.json` the practical policy boundary: a repository can share types, scopes, and style constraints without executing code. The current release intentionally does not evaluate JavaScript-based `commitlint.config.*` files.

## Composition and validation are separate

Composition guides a user toward a valid message. Validation checks a message that is already in the Source Control box. Keeping both paths is useful because messages may be pasted, edited after composition, or created by another tool.

Validation is intentionally policy-focused. It checks the header grammar and the configured local rules; it does not attempt to be a complete Conventional Commits body-and-footer parser.

## Commit remains under user control

By default, composition fills the commit box and stops. This gives the user a final opportunity to inspect staged files and edit the message. Teams or individuals who prefer a shorter flow can enable `commitAfterCompose`, while the explicit **Compose and Commit** command always requests an immediate Git commit.

