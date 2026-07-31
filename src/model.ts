export interface CommitType {
  readonly name: string;
  readonly description: string;
}

export interface TypeScopeRule {
  readonly groups?: readonly string[];
  readonly scopes?: readonly string[];
  readonly exclude?: readonly string[];
  readonly allowNone?: boolean;
  readonly allowCustom?: boolean;
}

export type ScopeGroups = Readonly<Record<string, readonly string[]>>;
export type TypeScopeMatrix = Readonly<Record<string, TypeScopeRule>>;

export interface TypeTrailerRule {
  readonly highValue?: readonly string[];
  readonly discouraged?: readonly string[];
}

export type TypeTrailerMatrix = Readonly<Record<string, TypeTrailerRule>>;

export interface CommitDraft {
  readonly type: string;
  readonly scope?: string;
  readonly description: string;
  readonly breaking: boolean;
  readonly body?: string;
  readonly breakingDescription?: string;
  readonly footers: readonly string[];
}

export interface CommitPolicy {
  readonly types: readonly CommitType[];
  readonly scopeGroups: ScopeGroups;
  readonly typeScopeMatrix: TypeScopeMatrix;
  readonly typeTrailerMatrix: TypeTrailerMatrix;
  readonly headerMaxLength: number;
  readonly requireLowercaseDescription: boolean;
  readonly allowFinalPeriod: boolean;
}

export interface ResolvedScopePolicy {
  readonly scopes: readonly string[];
  readonly excluded: readonly string[];
  readonly allowNone: boolean;
  readonly allowCustom: boolean;
}

export interface ResolvedTrailerPolicy {
  readonly highValue: readonly string[];
  readonly discouraged: readonly string[];
}
