import * as core from '@actions/core'
import * as github from '@actions/github'
import { execSync } from 'child_process'
import fs from 'fs'
import { CoverageChecker } from './CoverageChecker'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.info(JSON.stringify(github.context))

    // Specify the command to run
    const runCommand: string = core.getInput('runCommand')

    // Extract base and head branch names from the pull request payload
    const baseBranchName: string = github.context.payload.pull_request?.base.ref
    const headBranchName: string = github.context.payload.pull_request?.head.ref

    execSync(runCommand)

    const codeCoverageBaseBranch = JSON.parse(
      fs.readFileSync('coverage-summary.json', 'utf-8')
    )

    execSync('/usr/bin/git fetch')
    execSync('/usr/bin/git stash')
    execSync(`/usr/bin/git checkout --progress --force ${baseBranchName}`)

    execSync(runCommand)

    const codeCoverageHeadBranch = JSON.parse(
      fs.readFileSync('coverage-summary.json', 'utf-8')
    )

    const coverageChecker: any = new CoverageChecker(
      codeCoverageBaseBranch,
      codeCoverageHeadBranch
    )

    const coverageDetails = coverageChecker.getCoverageDetails()

    core.info(coverageDetails)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
