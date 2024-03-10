export class CoverageChecker {
  private diffCoverageReport: Record<string, any> = {}

  constructor(
    codeCoverageBaseBranch: Record<string, any>,
    codeCoverageHeadBranch: Record<string, any>
  ) {
    const filePaths = new Set([
      ...Object.keys(codeCoverageBaseBranch),
      ...Object.keys(codeCoverageHeadBranch)
    ])

    for (const filePath of filePaths) {
      this.diffCoverageReport[filePath] = {
        branches: this.getPercentagePair(
          codeCoverageBaseBranch[filePath]?.branches,
          codeCoverageHeadBranch[filePath]?.branches
        ),
        statements: this.getPercentagePair(
          codeCoverageBaseBranch[filePath]?.statements,
          codeCoverageHeadBranch[filePath]?.statements
        ),
        lines: this.getPercentagePair(
          codeCoverageBaseBranch[filePath]?.lines,
          codeCoverageHeadBranch[filePath]?.lines
        ),
        functions: this.getPercentagePair(
          codeCoverageBaseBranch[filePath]?.functions,
          codeCoverageHeadBranch[filePath]?.functions
        )
      }
    }
  }

  private getPercentage(coverageData: any): number {
    return coverageData?.pct || 0
  }

  private getPercentagePair(
    baseData: any,
    headData: any
  ): { newPercentage: number; oldPercentage: number } {
    return {
      newPercentage: this.getPercentage(baseData),
      oldPercentage: this.getPercentage(headData)
    }
  }

  getCoverageDetails(diffOnly: boolean, currentDirectory: string): any {
    return 'GET Coverage Details'
  }
}
