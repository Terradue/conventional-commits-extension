# Conventional Commit type-to-scope best practices

Conventional Commits standardizes the message structure but does not prescribe a universal list of scopes. The most reusable convention is:

- **type**: the nature of the change;
- **scope**: the affected package, subsystem, component, platform, or artefact.

| Type | Recommended scope categories | Representative scopes | Redundant or discouraged scopes |
|---|---|---|---|
| `feat` | Product areas, packages, services, components | `api`, `auth`, `cli`, `parser` | `feat`, `feature`, `new` |
| `fix` | Affected components, platforms, protocols | `router`, `windows`, `openapi` | `fix`, `bug`, `issue` |
| `security` | Affected security controls and attack surfaces | `auth`, `access-control`, `crypto`, `secrets`, `dependencies`, `supply-chain` | `security`, `vulnerability`, `vuln`, `fix`, `patch`, `cve` |
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
| `security(auth): reject replayed tokens` | `security(security): improve security` |

## Security as a project extension

Conventional Commits 1.0.0 defines the message grammar and the special meaning of `feat`, `fix`, and breaking-change indicators; it does not publish a closed standard type list. The bundled `security` type is therefore an intentional project convention. If commitlint or another tool restricts `type-enum`, configure the same extension there.

Security scopes should identify the control, boundary, or subsystem affected rather than repeat the type. The default `security-areas` group draws from established application-security domains:

- OWASP ASVS separates authentication, session management, access control, validation, cryptography, data protection, communication, APIs, logging, and configuration;
- GitHub's secure supply-chain guidance separately emphasizes vulnerable dependencies, leaked secrets, and vulnerable code patterns; and
- NIST's Secure Software Development Framework distinguishes protecting software, producing well-secured software, and responding to vulnerabilities.

Those sources support the generic defaults `auth`, `access-control`, `session`, `validation`, `crypto`, `secrets`, `data-protection`, `transport`, `api`, `dependencies`, `supply-chain`, `configuration`, and `logging`. They are a starting vocabulary, not a universal taxonomy: repository-specific components such as `oauth`, `rbac`, `sandbox`, `tls`, or `artifact-signing` remain valid custom scopes.

Sources: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [commitlint configuration](https://commitlint.js.org/reference/configuration.html), [OWASP ASVS categories](https://devguide.owasp.org/en/06-verification/01-guides/03-asvs/), [GitHub secure supply-chain guidance](https://docs.github.com/en/code-security/tutorials/implement-supply-chain-best-practices/securing-code), and [NIST SSDF](https://csrc.nist.gov/projects/ssdf).

## Contextual Git trailers

The default trailer policy provides suggestions and cautions rather than enforcement:

| Commit type | High-value trailers | Usually irrelevant or suspicious |
| --- | --- | --- |
| `feat` | `Refs`, `Implements`, `Spec`, `Release-note`, `BREAKING CHANGE`, `Co-authored-by`, `Tested-by` | `Fixes` referring to a causal commit |
| `fix` | `Fixes`, `Closes`, `Reported-by`, `Tested-by`, `Link`, `CVE`, `Backport-to` | `Implements-blueprint` |
| `docs` | `Refs`, `Link`, `Reviewed-by`, `Co-authored-by` | `Tested-by`, except for documentation builds |
| `refactor` | `Refs`, `Tested-by`, `Benchmark`, `Depends-on` | `Closes`, unless it genuinely resolves an issue |
| `perf` | `Benchmark`, `Test-results`, `Fixes`, `Refs`, `Reviewed-by` | `Release-note-none`, unless required by policy |
| `test` | `Refs`, `Reported-by`, `Test`, `Coverage`, `Fixes` | `BREAKING CHANGE` in most cases |
| `build` | `Generated-by`, `Dependency`, `Upstream`, `Build`, `Refs` | `Co-developed-by` unless genuinely applicable |
| `ci` | `CI`, `Test-plan`, `Build`, `Refs`, `Depends-on` | User-facing `Release-note` in most cases |
| `chore` | `Refs`, `Generated-by`, `Dependency-update`, `No-changelog` | `Fixes` unless the maintenance change fixes an actual defect |
| `revert` | `Reverts`, `Fixes`, `Link`, `Reported-by` | `Implements` |
| `security` | `CVE`, `GHSA`, `Security-impact`, `Fixes`, `Closes`, `Reported-by`, `Backport-to` | Public embargo details before disclosure |

`BREAKING CHANGE` is handled by the dedicated breaking-change step instead of the general trailer picker. Public repositories should keep undisclosed vulnerability and embargo details out of commit messages and use a private reporting or advisory channel until coordinated disclosure; see [GitHub's private vulnerability reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).

### Trailer meanings shown by the composer

Git defines trailers as structured `token: value` lines but intentionally allows projects to create their own tokens. The defaults use these concise meanings:

| Trailer | Meaning |
| --- | --- |
| `Refs` | Related issue, ticket, commit, or document; does not imply completion. |
| `Implements` | Requirement or blueprint fully implemented by the change. |
| `Implements-blueprint` | Blueprint implemented by the change, when recognized by project tooling. |
| `Spec` | Specification or design document governing the change. |
| `Release-note` | User-facing release note text or a reference to its source. |
| `Release-note-none` | Explicitly states that no user-facing release note is needed. |
| `BREAKING CHANGE` | Incompatible behavior and the migration required from consumers. |
| `Co-authored-by` | Additional author of the change, written as `Name <email>`. |
| `Co-developed-by` | Person who jointly developed the change, written as `Name <email>`. |
| `Tested-by` | Person who successfully tested the change, written as `Name <email>`. |
| `Reviewed-by` | Person who reviewed the change and found it acceptable, written as `Name <email>`. |
| `Reported-by` | Person who originally found and reported the defect, written as `Name <email>`. |
| `Fixes` | Issue or causal commit whose defect the change corrects. |
| `Closes` | Issue or report fully resolved by the change; may trigger tracker automation. |
| `Link` | URL to the relevant report, discussion, review, or supporting evidence. |
| `CVE` | Public CVE identifier for the vulnerability. |
| `GHSA` | GitHub Security Advisory identifier for the vulnerability or advisory. |
| `Security-impact` | Security implications or impact addressed by the change. |
| `Backport-to` | Target stable branch or release that should receive the change. |
| `Benchmark` | Benchmark command, result, or report demonstrating performance impact. |
| `Depends-on` | Change or dependency that must land before this change. |
| `Test-results` | Observed automated or manual test results for the change. |
| `Test` | Exact manual test or command used to verify the change. |
| `Test-plan` | Checks that reviewers or CI should perform to validate the change. |
| `Coverage` | Coverage result or report affected by the tests in the change. |
| `Generated-by` | Tool and version that generated the committed content. |
| `Dependency` | Dependency name, version, or constraint affected by the change. |
| `Dependency-update` | Dependency and version transition performed by the change. |
| `Upstream` | Upstream commit, issue, release, or source from which the change derives. |
| `Build` | Build tool, job, artifact, or result associated with the change. |
| `CI` | Continuous-integration workflow, job, or run associated with the change. |
| `No-changelog` | Explicitly omits the change from generated changelog entries. |
| `Reverts` | Commit or change intentionally undone by this commit. |

The established meanings above are grounded in [Git's trailer format](https://git-scm.com/docs/git-interpret-trailers), [Linux patch tags](https://kernel.org/doc/html/next/process/submitting-patches.html), [GitHub co-authorship](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors), [GitHub closing keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), [Conventional Commits breaking changes](https://www.conventionalcommits.org/en/v1.0.0/), [OpenStack commit tags](https://docs.openstack.org/contributors/common/git.html), [Chromium test and review footers](https://new.chromium.org/developers/contributing-code/-bug-syntax/), [Mesa backport tags](https://docs.mesa3d.org/submittingpatches.html), [CVE identifiers](https://www.cve.org/about/Process), and [GitHub advisory identifiers](https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/about-the-github-advisory-database). Tokens such as `Benchmark`, `Coverage`, `Generated-by`, and `Dependency-update` have no cross-project standard; their bundled descriptions are neutral policy defaults.

The bundled policy is intentionally generic. Projects can replace or extend every scope group, scope rule, and trailer rule through workspace settings.

In `contextualConventionalCommits.typeScopeMatrix`, express the representative values through `groups` and `scopes`, place the discouraged values in `exclude`, and use `allowNone` and `allowCustom` to choose how strict each type should be. Use `contextualConventionalCommits.typeTrailerMatrix` for `highValue` and `discouraged` trailer guidance. See [Configure a team policy](how-to/configure-policy.md) for a complete example.
