/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Arguments, Argv} from 'yargs';

import {error} from '../../utils/console';

import {rebasePr} from './index';

/** URL to the Github page where personal access tokens can be generated. */
export const GITHUB_TOKEN_GENERATE_URL = `https://github.com/settings/tokens`;

/** The options available to the rebase command via CLI. */
export interface RebaseCommandOptions {
  'github-token'?: string;
  prNumber: number;
}

/** Builds the rebase pull request command. */
export function buildRebaseCommand(yargs: Argv): Argv<RebaseCommandOptions> {
  return yargs
      .option('github-token', {
        type: 'string',
        description: 'Github token. If not set, token is retrieved from the environment variables.'
      })
      .positional('prNumber', {type: 'number', demandOption: true});
}


/** Handles the rebase pull request command. */
export async function handleRebaseCommand(args: Arguments<RebaseCommandOptions>) {
  const githubToken = args['github-token'] || process.env.GITHUB_TOKEN || process.env.TOKEN;
  if (!githubToken) {
    error('No Github token set. Please set the `GITHUB_TOKEN` environment variable.');
    error('Alternatively, pass the `--github-token` command line flag.');
    error(`You can generate a token here: ${GITHUB_TOKEN_GENERATE_URL}`);
    process.exit(1);
  }

  await rebasePr(args.prNumber, githubToken);
}
