# Why Conventional Commits?

[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) adds a lightweight structure to Git commit messages. The structure communicates whether a change fixes a defect, adds a feature, affects a particular area, or breaks compatibility.

This matters to both people and tools. A consistent history is easier to scan, and automation can use it to generate changelogs, calculate releases, or trigger publishing workflows.

## Relationship to Semantic Versioning

The specification gives three signals direct release meaning:

| Commit signal | Meaning | Typical SemVer effect |
| --- | --- | --- |
| `fix:` | Corrects a bug | PATCH |
| `feat:` | Adds a feature | MINOR |
| `!` or `BREAKING CHANGE:` | Introduces incompatible behavior | MAJOR |

Other types such as `docs`, `test`, and `refactor` are allowed, but the specification assigns them no automatic semantic-version effect. A project's release tooling may define additional rules.

## Structure separates concerns

Consider:

```text
fix(api): avoid duplicate status requests

Reuse the in-flight request until it resolves.

Refs: #42
```

- `fix` communicates the kind of change.
- `api` locates the affected area.
- the description makes the result scannable in a log.
- the body explains the reasoning.
- the footer connects the commit to other information.

The extension turns those decisions into a short sequence of focused prompts. It does not decide what your change means; it makes the chosen meaning consistent and correctly structured.

## Specification versus team convention

Conventional Commits deliberately leaves room for teams to define types and style. It requires a type and description, defines optional scopes, bodies and footers, and defines how breaking changes are signalled. It does not require a 72-character header, lowercase summary, or omission of a final period.

Those additional rules are defaults in this extension because consistency is useful, and they remain configurable as project policy.

