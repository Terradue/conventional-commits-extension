# Record breaking changes and issue links

## Mark a breaking change

1. Run **Git: Compose Contextual Conventional Commit** or **Git: Compose and Commit**.
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

The **Yes** choice carries type-specific guidance when `BREAKING CHANGE` appears in that type's `highValue` or `discouraged` trailer policy. It remains available for every type because a breaking change is determined by compatibility impact, not by the type name alone.

## Add issue references and trailers

The type-specific trailer picker remains open until you select **Finish trailers**:

1. Select a recommended token such as `Refs`, or select **Add custom trailer…** and enter a token.
2. Enter its value. A selected `Refs` token with value `#42` becomes `Refs: #42`.
3. Repeat to add more trailers, including another trailer with the same token.
4. If necessary, select **Remove an added trailer…** and choose the entry to discard.
5. Select **Finish trailers** when the list is complete.

For example, add these three token/value pairs:

```text
Refs → #42
Reviewed-by → A. Developer
Co-authored-by → Name <name@example.com>
```

They become:

```text
Refs: #42
Reviewed-by: A. Developer
Co-authored-by: Name <name@example.com>
```

Use hyphens instead of spaces in ordinary footer tokens, such as `Reviewed-by`. `BREAKING CHANGE` is the specification's special space-containing token and is generated automatically for a breaking commit.

Trailer values are entered separately, so they may contain commas. Custom tokens accept letters, numbers, and hyphens.

The **Add custom trailer…** action also displays the selected type's contextual cautions. These are advice rather than validation failures: for example, `Tested-by` is unusual for `docs`, but can be appropriate when a documentation build was tested.

For `security` commits, do not place undisclosed vulnerability or embargo details in public commit messages. Use the project's private advisory and disclosure process until publication is authorized.
