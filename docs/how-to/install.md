# Install the extension

## Install from a GitHub Release

1. Open the repository's [Releases page](https://github.com/Terradue/conventional-commits-extension/releases).
2. Open the release you want to install.
3. Download the `.vsix` file from **Assets**.
4. In VS Code, open the Command Palette.
5. Run **Extensions: Install from VSIX...**.
6. Select the downloaded file and confirm the installation.
7. Reload VS Code if prompted.

Open the Command Palette and search for **Git: Compose Contextual Conventional Commit** to confirm that the extension is active.

## Install from the command line

After downloading the release asset, run:

```bash
code --install-extension ./conventional-commits-extension-v0.1.0.vsix
```

Replace the filename with the asset you downloaded. Add `--force` when intentionally replacing an installed copy with the same version.

## Install a locally built package

From a checkout of the project:

```bash
npm install
npm run package
code --install-extension ./contextual-conventional-commits-0.1.0.vsix
```

The package command compiles, lints, tests, and packages the extension before producing the VSIX.

## Update or remove it

- To update from a VSIX, download the newer asset and repeat **Extensions: Install from VSIX...**.
- To remove it, open **Extensions**, find **Contextual Conventional Commits**, select the gear menu, and choose **Uninstall**.
