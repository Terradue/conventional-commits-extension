export interface CommitType {
  readonly name: string;
  readonly description: string;
}

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
  readonly scopes: readonly string[];
  readonly headerMaxLength: number;
  readonly requireLowercaseDescription: boolean;
  readonly allowFinalPeriod: boolean;
}
