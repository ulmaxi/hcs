import { cyan, yellow, white, gray } from 'ansi-colors';

// decorate the answers from the prompt
export const answer = (q: string) => q;

// decorate the question from the prompt
export const question = (q: string) => yellow(q);

/**
 * The languages used by HCS in this monorepo
 *
 */
export enum DevelopmentLanguages {
  DotNet = '.net',
  Typescript = 'typescript'
}

/**
 * retrieve operation response from console
 */
export interface Operation<T> {
  operation: T;
}
