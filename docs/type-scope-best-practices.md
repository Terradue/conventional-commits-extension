# Conventional Commit type-to-scope best practices

Conventional Commits standardizes the message structure but does not prescribe a universal list of scopes. The most reusable convention is:

- **type**: the nature of the change;
- **scope**: the affected package, subsystem, component, platform, or artefact.

| Type | Recommended scope categories | Representative scopes | Redundant or discouraged scopes |
|---|---|---|---|
| `feat` | Product areas, packages, services, components | `api`, `auth`, `cli`, `parser` | `feat`, `feature`, `new` |
| `fix` | Affected components, platforms, protocols | `router`, `windows`, `openapi` | `fix`, `bug`, `issue` |
| `perf` | Hot paths and performance-sensitive layers | `cache`, `database`, `renderer` | `perf`, `performance`, `speed` |
| `refactor` | Modules, packages, architecture layers | `core`, `storage`, `validation` | `refactor`, `code`, `cleanup` |
| `docs` | Documentation areas or documented components | `readme`, `api`, `tutorial`, `cli` | `docs`, `documentation` |
| `test` | Tested components or test layers | `parser`, `unit`, `integration`, `e2e` | `test`, `tests` |
| `build` | Build tools, package managers, packaging | `docker`, `vite`, `npm`, `uv`, `deps` | `build`, `ci` |
| `ci` | CI providers, workflows, pipeline stages | `github-actions`, `gitlab`, `release` | `ci` |
| `style` | Formatters, linters, affected modules | `prettier`, `eslint`, `ruff`, `parser` | `style`, `formatting` |
| `chore` | Repository metadata and housekeeping areas | `repo`, `metadata`, `templates`, `owners` | `chore`, `ci`, `docs` |
| `revert` | Usually none; occasionally reverted component | `parser`, `api` | `revert` |

## Default pair examples

| Preferred | Avoid |
|---|---|
| `build(pnpm): update lockfile` | `build(build): update build` |
| `ci(github-actions): add release job` | `ci(ci): add release job` |
| `docs(api): document pagination` | `docs(docs): update documentation` |
| `test(parser): cover escaped names` | `test(test): add tests` |
| `fix(auth): refresh expired tokens` | `fix(bug): refresh expired tokens` |
| `feat(cli): add JSON output` | `feat(feature): add JSON output` |

The bundled policy is intentionally generic. Projects can replace or extend every group and rule through workspace settings.
