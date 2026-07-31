import * as vscode from 'vscode';
import {
  formatCommit,
  resolveScopePolicy,
  resolveTrailerPolicy,
  validateCommit,
  validateTrailerToken
} from './conventional';
import { getRepository, inferScopes, type GitRepository } from './git';
import type {
  CommitDraft,
  CommitPolicy,
  CommitType,
  ScopeGroups,
  TrailerDescriptions,
  TypeScopeMatrix,
  TypeTrailerMatrix
} from './model';

const CONFIGURATION_SECTION = 'contextualConventionalCommits';

function getPolicy(resource?: vscode.Uri): CommitPolicy {
  const configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION, resource);
  return {
    types: configuration.get<CommitType[]>('types', []),
    scopeGroups: configuration.get<ScopeGroups>('scopeGroups', {}),
    typeScopeMatrix: configuration.get<TypeScopeMatrix>('typeScopeMatrix', {}),
    typeTrailerMatrix: configuration.get<TypeTrailerMatrix>('typeTrailerMatrix', {}),
    trailerDescriptions: configuration.get<TrailerDescriptions>('trailerDescriptions', {}),
    headerMaxLength: configuration.get<number>('headerMaxLength', 72),
    requireLowercaseDescription: configuration.get<boolean>('requireLowercaseDescription', true),
    allowFinalPeriod: configuration.get<boolean>('allowFinalPeriod', false)
  };
}

async function selectTrailers(type: string, policy: CommitPolicy): Promise<readonly string[] | undefined> {
  const trailerPolicy = resolveTrailerPolicy(type, policy);
  const trailers: string[] = [];

  type TrailerAction = 'add' | 'custom' | 'remove' | 'finish';
  type TrailerPick = vscode.QuickPickItem & { action: TrailerAction; token?: string };

  async function addTrailer(token: string): Promise<boolean> {
    const meaning = trailerPolicy.descriptions[token];
    const value = await vscode.window.showInputBox({
      title: `${token} trailer`,
      prompt: meaning ? `${meaning}. Enter the value for ${token}` : `Enter the value for ${token}`,
      placeHolder: token === 'Co-authored-by' || token === 'Tested-by' || token === 'Reviewed-by'
        ? 'Name <email@example.com>'
        : '#123 or project-specific value',
      validateInput: (input) => input.trim() ? undefined : 'A trailer value is required.'
    });
    if (value === undefined) return false;
    trailers.push(`${token}: ${value.trim()}`);
    return true;
  }

  while (true) {
    const recommended: TrailerPick[] = trailerPolicy.highValue
      .filter((token) => token !== 'BREAKING CHANGE')
      .map((token) => {
        const count = trailers.filter((trailer) => trailer.startsWith(`${token}:`)).length;
        const meaning = trailerPolicy.descriptions[token] ?? `Project-defined trailer recommended for ${type}`;
        return {
          label: token,
          description: count > 0 ? `${meaning} · added ${count}` : meaning,
          action: 'add',
          token
        };
      });
    const caution = trailerPolicy.discouraged.length > 0
      ? `Usually irrelevant or suspicious for ${type}: ${trailerPolicy.discouraged.join('; ')}`
      : undefined;
    const items: TrailerPick[] = [
      {
        label: '$(check) Finish trailers',
        description: trailers.length === 0 ? 'continue without trailers' : `use ${trailers.length} added trailer(s)`,
        action: 'finish'
      },
      ...recommended,
      {
        label: '$(add) Add custom trailer…',
        description: 'enter one custom token and value',
        detail: caution,
        action: 'custom'
      }
    ];
    if (trailers.length > 0) {
      items.push({
        label: '$(trash) Remove an added trailer…',
        description: trailers.join(' · '),
        action: 'remove'
      });
    }

    const selected = await vscode.window.showQuickPick(items, {
      title: `Conventional Commit: trailers for ${type} (${trailers.length} added)`,
      placeHolder: 'Add one trailer at a time, or finish',
      matchOnDescription: true,
      matchOnDetail: true
    });
    if (!selected) return undefined;
    if (selected.action === 'finish') return trailers;

    if (selected.action === 'remove') {
      const removed = await vscode.window.showQuickPick(
        trailers.map((trailer, index) => ({ label: trailer, index })),
        { title: 'Remove an added trailer', placeHolder: 'Select the trailer to remove' }
      );
      if (removed) trailers.splice(removed.index, 1);
      continue;
    }

    let token = selected.token;
    if (selected.action === 'custom') {
      const customToken = await vscode.window.showInputBox({
        title: 'Custom Git trailer token',
        prompt: 'Enter a token; its value is collected next',
        placeHolder: 'Reviewed-by',
        validateInput: validateTrailerToken
      });
      if (customToken === undefined) return undefined;
      token = customToken.trim();
    }

    if (token && !await addTrailer(token)) return undefined;
  }
}

async function selectType(policy: CommitPolicy): Promise<string | undefined> {
  const selected = await vscode.window.showQuickPick(
    policy.types.map((type) => ({ label: type.name, description: type.description })),
    { title: 'Conventional Commit: type', placeHolder: 'Select the nature of the change' }
  );
  return selected?.label;
}

async function selectScope(
  repository: GitRepository,
  type: string,
  policy: CommitPolicy
): Promise<string | undefined | null> {
  const configuration = vscode.workspace.getConfiguration(CONFIGURATION_SECTION, repository.rootUri);
  const resolved = resolveScopePolicy(type, policy);
  const inferred = configuration.get<boolean>('inferScopesFromChangedFiles', true)
    ? inferScopes(repository).filter((scope) => !resolved.excluded.includes(scope))
    : [];
  const scopes = [...new Set([...inferred, ...resolved.scopes])];

  type ScopePick = { label: string; description?: string; scope?: string; custom?: boolean };
  const items: ScopePick[] = scopes.map((scope) => ({
    label: scope,
    description: inferred.includes(scope) ? 'inferred from changed files' : undefined,
    scope
  }));
  if (resolved.allowNone) {
    items.unshift({ label: '$(circle-slash) No scope', scope: undefined });
  }
  if (resolved.allowCustom) {
    items.push({ label: '$(edit) Enter custom scope…', custom: true });
  }

  const selected = await vscode.window.showQuickPick(items, {
    title: `Conventional Commit: scope for ${type}`,
    placeHolder: 'Select the affected package, subsystem, component, or artefact',
    matchOnDescription: true
  });
  if (!selected) return null;
  if (!selected.custom) return selected.scope;

  const custom = await vscode.window.showInputBox({
    title: `Custom scope for ${type}`,
    prompt: 'Name the affected package, subsystem, component, or artefact',
    placeHolder: 'parser',
    validateInput: (value) => {
      const scope = value.trim();
      if (!scope) return 'Scope is required.';
      if (/\s/.test(scope)) return 'Scope must not contain whitespace.';
      if (resolved.excluded.includes(scope)) {
        return `Scope "${scope}" is redundant or forbidden for type "${type}".`;
      }
      return undefined;
    }
  });
  return custom?.trim() || null;
}

async function compose(repository: GitRepository): Promise<string | undefined> {
  const policy = getPolicy(repository.rootUri);
  const type = await selectType(policy);
  if (!type) return undefined;

  const scope = await selectScope(repository, type, policy);
  if (scope === null) return undefined;

  const prefixLength = type.length + (scope ? scope.length + 2 : 0) + 2;
  const description = await vscode.window.showInputBox({
    title: 'Conventional Commit: description',
    prompt: 'Describe the change in the imperative mood',
    placeHolder: 'add workflow status validation',
    validateInput: (value) => {
      if (!value.trim()) return 'Description is required.';
      const header = `${type}${scope ? `(${scope})` : ''}: ${value.trim()}`;
      return validateCommit(header, policy)[0];
    },
    valueSelection: [0, Math.max(0, policy.headerMaxLength - prefixLength)]
  });
  if (!description) return undefined;

  const trailerPolicy = resolveTrailerPolicy(type, policy);
  const breakingGuidance = trailerPolicy.highValue.includes('BREAKING CHANGE')
    ? trailerPolicy.descriptions['BREAKING CHANGE'] ?? `Recommended for incompatible ${type} changes`
    : trailerPolicy.discouraged.find((item) => item.startsWith('BREAKING CHANGE'))
      ?? 'Mark the commit as introducing a breaking change';
  const breakingChoice = await vscode.window.showQuickPick(
    [
      { label: 'No', breaking: false },
      { label: 'Yes', breaking: true, description: breakingGuidance }
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

  const footers = await selectTrailers(type, policy);
  if (!footers) return undefined;

  const draft: CommitDraft = {
    type,
    scope,
    description: description.trim(),
    breaking: breakingChoice.breaking,
    body: body.trim() || undefined,
    breakingDescription,
    footers
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
    vscode.commands.registerCommand('contextualConventionalCommits.compose', () => composeCommand(false)),
    vscode.commands.registerCommand('contextualConventionalCommits.validate', validateCommand),
    vscode.commands.registerCommand('contextualConventionalCommits.commit', () => composeCommand(true))
  );
}

export function deactivate(): void {}
