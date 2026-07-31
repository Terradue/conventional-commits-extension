import * as vscode from 'vscode';

export interface GitChange {
  readonly uri: vscode.Uri;
}

export interface GitRepository {
  readonly rootUri: vscode.Uri;
  readonly inputBox: { value: string };
  readonly state: {
    readonly indexChanges: readonly GitChange[];
    readonly workingTreeChanges: readonly GitChange[];
    readonly mergeChanges: readonly GitChange[];
  };
}

interface GitApi {
  readonly repositories: readonly GitRepository[];
}

interface GitExtensionExports {
  getAPI(version: 1): GitApi;
}

export async function getRepository(): Promise<GitRepository | undefined> {
  const extension = vscode.extensions.getExtension<GitExtensionExports>('vscode.git');
  if (!extension) {
    void vscode.window.showErrorMessage('The built-in Git extension is unavailable.');
    return undefined;
  }

  const exports = extension.isActive ? extension.exports : await extension.activate();
  const repositories = exports.getAPI(1).repositories;
  if (repositories.length === 0) {
    void vscode.window.showWarningMessage('No Git repository is open.');
    return undefined;
  }
  if (repositories.length === 1) {
    return repositories[0];
  }

  const selected = await vscode.window.showQuickPick(
    repositories.map((repository) => ({
      label: vscode.workspace.asRelativePath(repository.rootUri, false),
      description: repository.rootUri.fsPath,
      repository
    })),
    { placeHolder: 'Select the Git repository' }
  );
  return selected?.repository;
}

export function inferScopes(repository: GitRepository): readonly string[] {
  const changes = [
    ...repository.state.indexChanges,
    ...repository.state.workingTreeChanges,
    ...repository.state.mergeChanges
  ];
  const root = repository.rootUri.fsPath.replace(/[\\/]$/, '');
  const scopes = new Set<string>();

  for (const change of changes) {
    const path = change.uri.fsPath.slice(root.length).replace(/^[\\/]/, '');
    const firstSegment = path.split(/[\\/]/)[0];
    if (firstSegment && !firstSegment.startsWith('.')) {
      scopes.add(firstSegment.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase());
    }
  }
  return [...scopes].sort();
}
