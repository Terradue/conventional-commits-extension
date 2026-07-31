# Commit format

The extension generates messages based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

## Elements

| Element | Required | Extension behavior |
| --- | --- | --- |
| Type | Yes | Selected from `contextualConventionalCommits.types`. |
| Scope | Policy-dependent | Resolved after the type is selected and enclosed in parentheses. A type can allow, require, or effectively prohibit a scope. |
| `!` | No | Added when **breaking change** is **Yes**. |
| Description | Yes | Validated while it is entered. |
| Body | No | Collected in one input field and separated from the header by a blank line. |
| Footers | No | Recommended or custom trailers are added incrementally as token/value pairs, can be removed before finishing, and are emitted one per line. |
| `BREAKING CHANGE:` | For breaking compositions | Generated from the required breaking-change description. |

## Validation rules

The extension validates the first line against:

```text
<type>(<scope>)!: <description>
```

where scope and `!` are optional. It then applies the active policy:

- type must occur in the configured type list;
- scope must not contain whitespace;
- an absent scope is rejected when the selected type sets `allowNone` to `false`;
- scopes listed in the selected type's `exclude` rule are rejected;
- when `allowCustom` is `false`, the scope must occur in the list resolved for that type;
- the header must not exceed `headerMaxLength`;
- the description must start lowercase when `requireLowercaseDescription` is enabled; and
- the description must not end in a period unless `allowFinalPeriod` is enabled.

The last three rules are extension policy defaults, not Conventional Commits requirements.

## How scope policy is resolved

For the header's type, the extension:

1. reads its rule from `typeScopeMatrix` (or uses an empty rule when none exists);
2. expands every named entry in `groups` from `scopeGroups`;
3. appends the rule's direct `scopes` and removes duplicates and blank values;
4. removes every value named in `exclude`; and
5. defaults both `allowNone` and `allowCustom` to `true` when omitted.

An unknown group contributes no scopes. See [Settings](settings.md) for the complete schema.

## Examples

```text
fix: prevent duplicate requests
```

```text
feat(api): add health endpoint
```

```text
feat(api)!: remove legacy endpoint

Clients should migrate to /v2/status.

BREAKING CHANGE: the /v1/status endpoint is no longer available
Refs: #42
```

## Current input behavior

- The body prompt is a single VS Code input field, so the composer does not create a multi-paragraph body.
- Trailer values are collected individually and may contain commas.
- Custom tokens accept letters, numbers, and hyphens. Use hyphens instead of spaces; `BREAKING CHANGE` is handled by the dedicated breaking-change step.
- Validation checks the header and project policy; it is not a complete parser for every body and footer rule in the Conventional Commits specification.
