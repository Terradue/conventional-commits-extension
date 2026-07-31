# Policy and design

Contextual Conventional Commits is a thin interaction layer over VS Code's built-in Git support. Its design keeps composition close to the place where developers already inspect and commit changes.

## Local and repository-aware

The extension obtains repositories from VS Code's built-in Git extension. It reads their changed-file paths to suggest scopes and writes the finished message into the selected repository's normal Source Control input box.

No repository contents or commit messages are sent to an external service. Scope inference uses local paths only.

## Policy belongs with the resource

VS Code settings can apply to a user, workspace, or individual workspace folder. The extension resolves policy against the selected repository, which gives a multi-root workspace the right configuration for each project.

This makes `.vscode/settings.json` the practical policy boundary: a repository can share types, contextual scope rules, trailer guidance, and style constraints without executing code. The current release intentionally does not evaluate JavaScript-based `commitlint.config.*` files.

## Scope is contextual, not a flat list

The type and scope describe different dimensions: the type says what kind of change occurred, while the scope identifies the package, subsystem, component, platform, or artefact affected. The composer therefore asks for the type before it offers a scope.

Each type can reuse named scope groups, add direct scopes, exclude redundant pairings, require a scope, and decide whether an unlisted custom scope is acceptable. This makes pairings such as `build(npm)` available without encouraging `build(build)`, and lets a strict project reject `build(api)` when `api` is not part of its build policy.

Rules omitted from `typeScopeMatrix` remain permissive: no configured scopes are resolved, but an unscoped or custom-scoped commit is allowed by default. This prevents adding a custom type from silently making it unusable.

## Trailer guidance is contextual, not mandatory

Trailer value depends on intent. `Fixes` is strong evidence for a defect correction, while it can be misleading on a feature that merely relates to an earlier commit. The composer therefore offers `highValue` tokens after the type is known and surfaces `discouraged` guidance beside the custom-trailer escape hatch.

Neither list is an allowlist or a validation rule. Conditional cases remain possible, and projects can replace the complete matrix. `BREAKING CHANGE` stays in the `feat` guidance model but is generated through the dedicated breaking-change flow so the header and footer signals remain consistent.

## Composition and validation are separate

Composition guides a user toward a valid message. Validation checks a message that is already in the Source Control box. Keeping both paths is useful because messages may be pasted, edited after composition, or created by another tool.

Validation is intentionally policy-focused. It checks the header grammar and the configured local rules; it does not attempt to be a complete Conventional Commits body-and-footer parser.

## Commit remains under user control

By default, composition fills the commit box and stops. This gives the user a final opportunity to inspect staged files and edit the message. Teams or individuals who prefer a shorter flow can enable `commitAfterCompose`, while the explicit **Compose and Commit** command always requests an immediate Git commit.
