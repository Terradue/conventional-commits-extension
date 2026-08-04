# Conventional Commit type-to-scope best practices

Conventional Commits standardizes the message structure but does not prescribe a universal list of scopes. The most reusable convention is:

- **type**: the nature of the change;
- **scope**: the affected package, subsystem, component, platform, or artefact.

| Type | Recommended scope categories | Representative scopes | Redundant or discouraged scopes |
|---|---|---|---|
| `a11y` | Components, screens, interactions, assistive technology | `dialog`, `forms`, `keyboard` | `a11y`, `accessibility` |
| `api` | Services, resources, versions, protocols | `auth`, `orders`, `v2` | `api`; prefer `feat(api)` or `fix(api)` when that better conveys consumer impact |
| `build` | Build tools, package managers, bundlers, compilers, packaging targets | `docker`, `gradle`, `npm`, `pnpm`, `webpack` | `build`, `ci`, `code` |
| `chore` | Repository metadata and housekeeping areas | `metadata`, `owners`, `repo`, `templates` | `chore`, `ci`, `docs` |
| `ci` | CI providers, workflows, pipeline stages, runners | `codecov`, `github-actions`, `gitlab`, `lint`, `release` | `ci`; `build` unless it names a specific build job |
| `config` | Services, environment classes, subsystems, integrations | `api`, `logging`, `storage` | `config`; deployment work better represented by `build`, `ci`, or `infra` |
| `data` | Datasets, catalogues, migration domains, mappings | `catalogue`, `countries`, `mappings` | `data`; database code changes |
| `deps` | Runtime, development, optional, platform, ecosystem | `dev`, `node`, `python`, `runtime` | `deps`; unnecessary package-name scopes |
| `docs` | Documentation sections, audiences, packages, APIs, guides | `api`, `cli`, `contributing`, `readme`, `tutorial` | `docs`, `documentation` |
| `feat` | Product areas, packages, services, components | `api`, `auth`, `checkout`, `cli`, `parser` | `code`, `feat`, `feature`, `new` |
| `fix` | Affected components, platforms, protocols | `openapi`, `router`, `windows` | `bug`, `fix`, `issue` |
| `i18n` | Locales, application areas, translation catalogues | `checkout`, `fr`, `it` | `i18n`; general UI changes |
| `infra` | Terraform modules, Kubernetes components, cloud services, environments | `database`, `kubernetes`, `network`, `terraform` | `infra`; CI workflow changes |
| `legal` | Licenses, notices, privacy, attribution | `license`, `notices`, `privacy` | `legal` |
| `meta` | Repository and package metadata, catalogues, badges | `citation`, `codemeta`, `package` | `meta`, `metadata`; work better represented by `build`, `chore`, or `docs` |
| `perf` | Hot paths and performance-sensitive layers | `cache`, `database`, `renderer` | `perf`, `performance`, `speed` |
| `refactor` | Modules, packages, architecture layers | `core`, `storage`, `validation` | `cleanup`, `code`, `refactor` |
| `release` | Packages, distribution channels, documentation sites, images, platforms | `cli`, `container`, `npm` | `release`; normal feature or bug changes |
| `revert` | Usually none; occasionally reverted component | `api`, `parser` | `revert` |
| `schema` | Schema families, APIs, events, entities, protocols, packages | `database`, `events`, `openapi`, `stac` | `schema`; implementation-only changes |
| `security` | Affected security controls and attack surfaces | `access-control`, `auth`, `crypto`, `dependencies`, `secrets`, `supply-chain` | `cve`, `fix`, `patch`, `security`, `vuln`, `vulnerability` |
| `style` | Formatters, linters, affected modules | `eslint`, `parser`, `prettier`, `ruff` | `formatting`, `style` |
| `test` | Tested packages, test layers, suites, integrations, fixtures | `api`, `e2e`, `integration`, `parser` | `coverage`, `test`, `tests` |
| `ux` | Flows, screens, components, accessibility areas | `checkout`, `navigation`, `onboarding` | `ux`; functional work better represented by `feat` |

## Default pair examples

| Preferred | Avoid |
|---|---|
| `a11y(dialog): restore keyboard focus` | `a11y(accessibility): improve accessibility` |
| `api(orders): publish the v2 contract` | `api(api): update API` |
| `build(pnpm): update lockfile` | `build(build): update build` |
| `ci(github-actions): add release job` | `ci(ci): add release job` |
| `config(logging): reduce production verbosity` | `config(config): update configuration` |
| `data(countries): refresh ISO mappings` | `data(data): update data` |
| `deps(runtime): upgrade React to 19.1` | `deps(deps): upgrade dependencies` |
| `docs(api): document pagination` | `docs(docs): update documentation` |
| `feat(cli): add JSON output` | `feat(feature): add JSON output` |
| `fix(auth): refresh expired tokens` | `fix(bug): refresh expired tokens` |
| `i18n(it): update checkout labels` | `i18n(i18n): update translations` |
| `infra(terraform): add database replica` | `infra(infra): update infrastructure` |
| `legal(license): update copyright year` | `legal(legal): update legal files` |
| `meta(codemeta): update project authors` | `meta(metadata): update metadata` |
| `release(container): publish 2.0 image` | `release(release): prepare release` |
| `schema(openapi): add batch endpoint contract` | `schema(schema): update schema` |
| `security(auth): reject replayed tokens` | `security(security): improve security` |
| `test(parser): cover escaped names` | `test(test): add tests` |
| `ux(onboarding): clarify the first-run flow` | `ux(ux): improve user experience` |

## Sources of the default type vocabulary

Conventional Commits defines `feat` and `fix` as the types with standard semantic-version meaning and permits additional project-defined types. The bundled vocabulary is therefore a compatibility-oriented synthesis rather than a claim that every listed type belongs to the core specification.

| Source | Types or practices represented in the defaults |
| --- | --- |
| [Angular commit guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md) | `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `test` |
| [Atom commit guidelines, preserved by the Conventional Changelog preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-atom) | Documentation, formatting, performance, security, test, and CI intent reinforce the corresponding synthesized types. |
| [commitlint conventional configuration](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) | The common Angular-derived set, including `chore`, `revert`, and `style`; projects may replace its `type-enum`. |
| [Conventional Changelog](https://conventional-changelog.js.org/) | Preset-based parsing and changelog sections for features, fixes, performance improvements, and breaking changes. |
| [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) | `feat`, `fix`, and the breaking-change indicators; other types remain project-defined. |
| [Release Please](https://github.com/googleapis/release-please#how-should-i-write-my-commits) | `deps`, `feat`, and `fix` as ordinary releasable units, with language-specific variations. |
| [semantic-release](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-change-the-type-of-commits-that-trigger-a-release) | Breaking changes plus `feat`, `fix`, and `perf` in its default Angular-based release rules. |
| [Vue commit convention](https://github.com/vuejs/core/blob/main/.github/commit-convention.md) | The Angular-derived types, `chore`, `style`, and the special `revert` form represented by the synthesis. |
| Common monorepo and domain conventions | `a11y`, `api`, `config`, `data`, `deps`, `i18n`, `infra`, `legal`, `meta`, `release`, `schema`, `security`, and `ux` cover optional first-class concerns; package names remain scopes rather than types. |

The default list is alphabetized for predictable picker navigation. The domain-oriented entries are project-defined extensions: use them when the distinction is valuable, and remove them from workspace policy when a core type plus a scope communicates the change more clearly—for example, prefer `feat(api)` over `api` for an externally observable API feature.

## Security as a project extension

Conventional Commits 1.0.0 defines the message grammar and the special meaning of `feat`, `fix`, and breaking-change indicators; it does not publish a closed standard type list. The bundled `security` type is therefore an intentional project convention. If commitlint or another tool restricts `type-enum`, configure the same extension there.

Security scopes should identify the control, boundary, or subsystem affected rather than repeat the type. The default `security-areas` group draws from established application-security domains:

- OWASP ASVS separates authentication, session management, access control, validation, cryptography, data protection, communication, APIs, logging, and configuration;
- GitHub's secure supply-chain guidance separately emphasizes vulnerable dependencies, leaked secrets, and vulnerable code patterns; and
- NIST's Secure Software Development Framework distinguishes protecting software, producing well-secured software, and responding to vulnerabilities.

Those sources support the generic defaults `access-control`, `api`, `auth`, `configuration`, `crypto`, `data-protection`, `dependencies`, `logging`, `secrets`, `session`, `supply-chain`, `transport`, and `validation`. They are a starting vocabulary, not a universal taxonomy: repository-specific components such as `artifact-signing`, `oauth`, `rbac`, `sandbox`, or `tls` remain valid custom scopes.

Sources: [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [commitlint configuration](https://commitlint.js.org/reference/configuration.html), [OWASP ASVS categories](https://devguide.owasp.org/en/06-verification/01-guides/03-asvs/), [GitHub secure supply-chain guidance](https://docs.github.com/en/code-security/tutorials/implement-supply-chain-best-practices/securing-code), and [NIST SSDF](https://csrc.nist.gov/projects/ssdf).

## Contextual Git trailers

The default trailer policy provides suggestions and cautions rather than enforcement:

| Commit type | High-value trailers | Usually irrelevant or suspicious |
| --- | --- | --- |
| `a11y` | `Refs`, `Reported-by`, `Test`, `Tested-by` | `BREAKING CHANGE`, unless the accessibility contract changes incompatibly |
| `api` | `BREAKING CHANGE`, `Implements`, `Refs`, `Spec`, `Tested-by` | `Release-note-none`, unless required by policy |
| `build` | `Build`, `Dependency`, `Generated-by`, `Refs`, `Upstream` | `Co-developed-by` unless genuinely applicable |
| `chore` | `Dependency-update`, `Generated-by`, `No-changelog`, `Refs` | `Fixes` unless the maintenance change fixes an actual defect |
| `ci` | `Build`, `CI`, `Depends-on`, `Refs`, `Test-plan` | User-facing `Release-note` in most cases |
| `config` | `Refs`, `Security-impact`, `Test-plan`, `Tested-by` | `BREAKING CHANGE`, unless consumers depend on the configuration contract |
| `data` | `Generated-by`, `Refs`, `Test-results`, `Tested-by` | `Release-note`, unless consumers observe the data change |
| `deps` | `Dependency`, `Dependency-update`, `Refs`, `Security-impact`, `Upstream` | `BREAKING CHANGE`, unless consumers must change their code |
| `docs` | `Co-authored-by`, `Link`, `Refs`, `Reviewed-by` | `Tested-by`, except for documentation builds |
| `feat` | `BREAKING CHANGE`, `Co-authored-by`, `Implements`, `Refs`, `Release-note`, `Spec`, `Tested-by` | `Fixes` referring to a causal commit |
| `fix` | `Backport-to`, `CVE`, `Closes`, `Fixes`, `Link`, `Reported-by`, `Tested-by` | `Implements-blueprint` |
| `i18n` | `Refs`, `Reviewed-by`, `Tested-by` | `BREAKING CHANGE` in most cases |
| `infra` | `Build`, `CI`, `Depends-on`, `Refs`, `Test-plan` | `Release-note`, unless infrastructure is a supported product surface |
| `legal` | `Co-authored-by`, `Link`, `Refs`, `Reviewed-by` | `Tested-by` in most cases |
| `meta` | `Generated-by`, `Link`, `Refs` | `Fixes`, unless metadata corrects a tracked defect |
| `perf` | `Benchmark`, `Fixes`, `Refs`, `Reviewed-by`, `Test-results` | `Release-note-none`, unless required by policy |
| `refactor` | `Benchmark`, `Depends-on`, `Refs`, `Tested-by` | `Closes`, unless it genuinely resolves an issue |
| `release` | `Build`, `CI`, `Link`, `Refs`, `Release-note` | `Fixes`, unless release preparation corrects a defect |
| `revert` | `Fixes`, `Link`, `Reported-by`, `Reverts` | `Implements` |
| `schema` | `BREAKING CHANGE`, `Implements`, `Refs`, `Spec`, `Tested-by` | `Release-note-none`, unless required by policy |
| `security` | `Backport-to`, `CVE`, `Closes`, `Fixes`, `GHSA`, `Reported-by`, `Security-impact` | Public embargo details before disclosure |
| `style` | `Generated-by`, `Refs`, `Reviewed-by` | `BREAKING CHANGE` in most cases |
| `test` | `Coverage`, `Fixes`, `Refs`, `Reported-by`, `Test` | `BREAKING CHANGE` in most cases |
| `ux` | `Refs`, `Release-note`, `Reviewed-by`, `Tested-by` | `BREAKING CHANGE`, unless the interaction contract changes incompatibly |

`BREAKING CHANGE` is handled by the dedicated breaking-change step instead of the general trailer picker. Public repositories should keep undisclosed vulnerability and embargo details out of commit messages and use a private reporting or advisory channel until coordinated disclosure; see [GitHub's private vulnerability reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).

### Trailer meanings shown by the composer

Git defines trailers as structured `token: value` lines but intentionally allows projects to create their own tokens. The defaults use these concise meanings:

| Trailer | Meaning |
| --- | --- |
| `BREAKING CHANGE` | Incompatible behavior and the migration required from consumers. |
| `Backport-to` | Target stable branch or release that should receive the change. |
| `Benchmark` | Benchmark command, result, or report demonstrating performance impact. |
| `Build` | Build tool, job, artifact, or result associated with the change. |
| `CI` | Continuous-integration workflow, job, or run associated with the change. |
| `CVE` | Public CVE identifier for the vulnerability. |
| `Closes` | Issue or report fully resolved by the change; may trigger tracker automation. |
| `Co-authored-by` | Additional author of the change, written as `Name <email>`. |
| `Co-developed-by` | Person who jointly developed the change, written as `Name <email>`. |
| `Coverage` | Coverage result or report affected by the tests in the change. |
| `Dependency` | Dependency name, version, or constraint affected by the change. |
| `Dependency-update` | Dependency and version transition performed by the change. |
| `Depends-on` | Change or dependency that must land before this change. |
| `Fixes` | Issue or causal commit whose defect the change corrects. |
| `GHSA` | GitHub Security Advisory identifier for the vulnerability or advisory. |
| `Generated-by` | Tool and version that generated the committed content. |
| `Implements` | Requirement or blueprint fully implemented by the change. |
| `Implements-blueprint` | Blueprint implemented by the change, when recognized by project tooling. |
| `Link` | URL to the relevant report, discussion, review, or supporting evidence. |
| `No-changelog` | Explicitly omits the change from generated changelog entries. |
| `Refs` | Related issue, ticket, commit, or document; does not imply completion. |
| `Release-note` | User-facing release note text or a reference to its source. |
| `Release-note-none` | Explicitly states that no user-facing release note is needed. |
| `Reported-by` | Person who originally found and reported the defect, written as `Name <email>`. |
| `Reverts` | Commit or change intentionally undone by this commit. |
| `Reviewed-by` | Person who reviewed the change and found it acceptable, written as `Name <email>`. |
| `Security-impact` | Security implications or impact addressed by the change. |
| `Spec` | Specification or design document governing the change. |
| `Test` | Exact manual test or command used to verify the change. |
| `Test-plan` | Checks that reviewers or CI should perform to validate the change. |
| `Test-results` | Observed automated or manual test results for the change. |
| `Tested-by` | Person who successfully tested the change, written as `Name <email>`. |
| `Upstream` | Upstream commit, issue, release, or source from which the change derives. |

The established meanings above are grounded in [Git's trailer format](https://git-scm.com/docs/git-interpret-trailers), [Linux patch tags](https://kernel.org/doc/html/next/process/submitting-patches.html), [GitHub co-authorship](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors), [GitHub closing keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue), [Conventional Commits breaking changes](https://www.conventionalcommits.org/en/v1.0.0/), [OpenStack commit tags](https://docs.openstack.org/contributors/common/git.html), [Chromium test and review footers](https://new.chromium.org/developers/contributing-code/-bug-syntax/), [Mesa backport tags](https://docs.mesa3d.org/submittingpatches.html), [CVE identifiers](https://www.cve.org/about/Process), and [GitHub advisory identifiers](https://docs.github.com/en/code-security/concepts/vulnerability-reporting-and-management/about-the-github-advisory-database). Tokens such as `Benchmark`, `Coverage`, `Generated-by`, and `Dependency-update` have no cross-project standard; their bundled descriptions are neutral policy defaults.

The bundled policy is intentionally generic. Projects can replace or extend every scope group, scope rule, and trailer rule through workspace settings.

In `contextualConventionalCommits.typeScopeMatrix`, express the representative values through `groups` and `scopes`, place the discouraged values in `exclude`, and use `allowNone` and `allowCustom` to choose how strict each type should be. Use `contextualConventionalCommits.typeTrailerMatrix` for `highValue` and `discouraged` trailer guidance. See [Configure a team policy](how-to/configure-policy.md) for a complete example.
