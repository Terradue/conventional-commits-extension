import * as vscode from 'vscode';
import { formatCommit, validateCommit } from './conventional';
import { getRepository, inferScopes, type GitRepository } from './git';
import type { CommitDraft, CommitPolicy, CommitType } from './model';

const CONFIGURATION_SECTION = 'terradueConventionalCommits';

function getPolicy(resource?: vscode.Uri): CommitPolicy {
  const configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION, resource);
  return {
    types: configuration.get<CommitType[]>('types', []),
    scopes: configuration.get<string[]>('scopes', []),
    headerMaxLength: configuration.get<number>('headerMaxLength', 72),
    requireLowercaseDescription: configuration.get<boolean>('requireLowercaseDescription', true),
    allowFinalPeriod: configuration.get<boolean>('allowFinalPeriod', false)
  };
}

async function selectType(policy: CommitPolicy): Promise<string | undefined> {
  const selected = await vscode.window.showQuickPick(
    policy.types.map((type) => ({ label: type.name, description: type.description })),
    { title: 'Conventional Commit: type', placeHolder: 'Select the nature of the change' }
  );
  return selected?.label;
}

async function selectScope(repository: GitRepository, policy: CommitPolicy): Promise<string | undefined | null> {
  const configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION, repository.rootUri);
  const inferred = configuration.get<boolean>('inferScopesFromChangedFiles', true)
    ? inferScopes(repository)
    : [];
  const scopes = [...new Set([...inferred, ...policy.scopes])];
  const selected = await vscode.window.showQuickPick(
    [
      { label: '$(circle-slash) No scope', scope: undefined },
      ...scopes.map((scope) => ({ label: scope, scope }))
    ],
    {
      title: 'Conventional Commit: scope',
      placeHolder: 'Select the affected subsystem',
      matchOnDescription: true
    }
  );
  return selected ? selected.scope : null;
}

async function compose(repository: GitRepository): Promise<string | undefined> {
  const policy = getPolicy(repository.rootUri);
  const type = await selectType(policy);
  if (!type) return undefined;

  const scope = await selectScope(repository, policy);
  if (scope === null) return undefined;

  const prefixLength = type.length + (scope ? scope.length + 2 : 0) + 2;
  const description = await vscode.window.showInputBox({
    title: 'Conventional Commit: description',
    prompt: 'Describe the change in the imperative mood',
    placeHolder: 'add workflow status validation',
    validateInput: (value) => {
      if (!value.trim()) return 'Description is required.';
      const header = `${type}${scope ? `(${scope})` : ''}: ${value.trim()}`;
      const errors = validateCommit(header, policy);
      return errors[0];
    },
    valueSelection: [0, Math.max(0, policy.headerMaxLength - prefixLength)]
  });
  if (!description) return undefined;

  const breakingChoice = await vscode.window.showQuickPick(
    [
      { label: 'No', breaking: false },
      { label: 'Yes', breaking: true, description: 'Mark the commit as introducing a breaking change' }
    ],
    { title: 'Conventional Commit: breaking change?' }
  );
  if (!breakingChoice) return undefined;

  let breakingDescription: string | undefined;
  if (breakingChoice.breaking) {
    breakingDescription = await vscode.window.showInputBox({
      title: 'Breaking-change description',
      prompt: 'Explain the incompatible public change',
      placeHolder: 'the legacy status field has been removed',
      validateInput: (value) => value.trim() ? undefined : 'A breaking-change description is required.'
    });
    if (!breakingDescription) return undefined;
  }

  const body = await vscode.window.showInputBox({
    title: 'Conventional Commit: body',
    prompt: 'Optional context or motivation; leave empty to skip',
    placeHolder: 'Explain why the change was necessary'
  });
  if (body === undefined) return undefined;

  const footerInput = await vscode.window.showInputBox({
    title: 'Conventional Commit: footers',
    prompt: 'Optional comma-separated Git trailers',
    placeHolder: 'Refs: #123, Co-authored-by: Name <email@example.com>'
  });
  if (footerInput === undefined) return undefined;

  const draft: CommitDraft = {
    type,
    scope,
    description: description.trim(),
    breaking: breakingChoice.breaking,
    body: body.trim() || undefined,
    breakingDescription,
    footers: footerInput.split(',').map((footer) => footer.trim()).filter(Boolean)
  };
  const message = formatCommit(draft);
  const errors = validateCommit(message, policy);
  if (errors.length > 0) {
    void vscode.window.showErrorMessage(errors.join(' '));
    return undefined;
  }
  return message;
}

async function composeCommand(commit: boolean): Promise<void> {
  const repository = await getRepository();
  if (!repository) return;
  const message = await compose(repository);
  if (!message) return;

  repository.inputBox.value = message;
  const configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION, repository.rootUri);
  if (commit || configuration.get<boolean>('commitAfterCompose', false)) {
    await vscode.commands.executeCommand('git.commit');
  } else {
    void vscode.window.showInformationMessage('Conventional Commit message written to Source Control.');
  }
}

async function validateCommand(): Promise<void> {
  const repository = await getRepository();
  if (!repository) return;
  const message = repository.inputBox.value;
  if (!message.trim()) {
    void vscode.window.showWarningMessage('The Source Control commit message is empty.');
    return;
  }
  const errors = validateCommit(message, getPolicy(repository.rootUri));
  if (errors.length === 0) {
    void vscode.window.showInformationMessage('The commit message is valid.');
  } else {
    void vscode.window.showErrorMessage(errors.join(' '));
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('terradueConventionalCommits.compose', () => composeCommand(false)),
    vscode.commands.registerCommand('terradueConventionalCommits.validate', validateCommand),
    vscode.commands.registerCommand('terradueConventionalCommits.commit', () => composeCommand(true))
  );
}

export function deactivate(): void {}
