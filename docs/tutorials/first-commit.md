# Create your first conventional commit

In this tutorial you will change a file, compose a Conventional Commit through VS Code, inspect the generated message, and commit it. The example produces this message:

```text
docs(docs): improve installation instructions

Explain how to install a downloaded VSIX.

Refs: #123
```

Allow about five minutes.

## Before you begin

You need:

- VS Code 1.95 or newer;
- the Terradue Conventional Commits extension [installed](../how-to/install.md);
- a folder containing a Git repository; and
- at least one changed file.

If you want to follow the example closely, edit a file inside a top-level `docs` directory. The extension will infer `docs` as a possible scope. Any changed file is suitable, however.

## 1. Open Source Control

1. Open your Git repository in VS Code.
2. Select **Source Control** in the Activity Bar, or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd> (<kbd>⌃</kbd>+<kbd>⇧</kbd>+<kbd>G</kbd> on macOS).
3. Find your changed file under **Changes**.
4. Select the **+** beside the file to stage it.

Staging first makes it clear exactly what the commit will contain. The composer considers staged, unstaged, and merge changes when suggesting scopes.

## 2. Start the composer

Use either of these entry points:

- Open the Command Palette with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> (<kbd>⇧</kbd>+<kbd>⌘</kbd>+<kbd>P</kbd> on macOS), type **Git: Compose Conventional Commit**, and press <kbd>Enter</kbd>.
- Select the **Compose Conventional Commit** checklist icon in the Source Control view.

If the workspace contains several Git repositories, choose the repository that contains your staged change. With one repository, this step is skipped.

## 3. Choose the type

The first list describes the nature of the change. Select **docs** because this example changes documentation.

The two types with standard release meaning are:

- **fix** for a bug fix;
- **feat** for a new feature.

The project policy can offer other types, including `docs`, `test`, `refactor`, and `chore`. Choose the type that describes the change itself, not the file you happened to edit.

## 4. Choose the scope

Select **docs** when it appears in the scope list.

A scope identifies the affected part of the codebase and becomes the parenthesised part of the header. The extension lists inferred scopes first, followed by configured scopes. Select **No scope** when the change affects the whole repository or no scope adds useful information.

## 5. Write the description

Enter:

```text
improve installation instructions
```

Use a short, imperative summary that completes the thought “this commit will…”. With the default extension policy:

- begin with a lowercase character;
- do not end with a period; and
- keep the entire header within 72 characters.

The field reports a policy error immediately. Correct the description before continuing.

## 6. Decide whether the change is breaking

Select **No** for this example.

Selecting **Yes** adds `!` before the colon and asks for an explanation of the incompatible public change. The explanation is written as a `BREAKING CHANGE:` footer. Use this only when consumers must change how they use the software.

## 7. Add context in the body

Enter:

```text
Explain how to install a downloaded VSIX.
```

The body is optional. It should explain motivation or context that is not obvious from the header. Leave the field empty to omit it.

## 8. Link related work with a footer

Enter:

```text
Refs: #123
```

Footers are optional. For multiple footers, separate them with commas, for example:

```text
Refs: #123, Reviewed-by: A. Developer
```

The extension places each footer on its own line. Do not use a comma inside an individual footer value because commas delimit footers in the current composer.

## 9. Review the generated message

After the final prompt, the extension writes the message into the Source Control commit box. It does not commit yet with the default settings.

Check that the box contains:

```text
docs(docs): improve installation instructions

Explain how to install a downloaded VSIX.

Refs: #123
```

To verify it again, select **Validate Conventional Commit** beside the commit box. VS Code displays **The commit message is valid.**

## 10. Commit the staged change

1. Confirm that only the intended files are staged.
2. Select **Commit** in the Source Control view, or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> while the commit box is focused.
3. If VS Code asks whether to stage other changes, read the prompt carefully and choose according to what you intend to include.

You have created a structured commit without manually assembling its syntax.

## Next steps

- [Configure a shared project policy](../how-to/configure-policy.md).
- [Record a breaking change](../how-to/breaking-changes-and-footers.md).
- Review the complete [commit format reference](../reference/commit-format.md).

