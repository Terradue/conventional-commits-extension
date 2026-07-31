# Record breaking changes and issue links

## Mark a breaking change

1. Run **Git: Compose Conventional Commit** or **Git: Compose and Commit**.
2. Select the type and scope, then enter the description.
3. At **Conventional Commit: breaking change?**, select **Yes**.
4. Describe what consumers must do differently. Be specific about migration, replacement, or removed behavior.
5. Complete the optional body and footer prompts.

For a breaking API change, the result resembles:

```text
feat(api)!: remove the legacy status field

The v2 representation now has one canonical status property.

BREAKING CHANGE: clients must read state instead of status
```

The extension emits both accepted Conventional Commits signals: `!` in the header and a `BREAKING CHANGE:` footer containing the migration explanation.

## Add issue references and trailers

At the footers prompt, enter comma-separated Git-trailer-style values:

```text
Refs: #42, Reviewed-by: A. Developer, Co-authored-by: Name <name@example.com>
```

They become:

```text
Refs: #42
Reviewed-by: A. Developer
Co-authored-by: Name <name@example.com>
```

Use hyphens instead of spaces in ordinary footer tokens, such as `Reviewed-by`. `BREAKING CHANGE` is the specification's special space-containing token and is generated automatically for a breaking commit.

!!! warning
    The current prompt treats every comma as a footer separator. A footer value cannot itself contain a comma when composed through the extension.

