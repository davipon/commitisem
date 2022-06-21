import { NodePackageManager } from "@preset/core"

export default definePreset({
  name: 'commitisem',
	options: {
		package: <NodePackageManager>'npm'
	},
	postInstall: ({ hl }) => [
		`This preset has added/ updated ${hl('package.json')} & ${hl('.husky')} (also lock file depends on your package manager)`,
		``,
		`Use ${hl('npx cz')} instead of ${hl('git commit')} when commiting (alt: ${hl('yarn cz')} or ${hl('pnpm cz')})`,
		``,
		`${hl('CHANGELOG.md')} will be generated once you release a new version using ${hl('npm run release:(major|minor|patch)')}`,
	],
  handler: async (context) => {
    await installPackages({
      title: 'Installing packages',
      for: 'node',
      packages: [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        '@commitlint/cz-commitlint',
        'commitizen',
        'husky',
        'inquirer',
        'standard-version'
      ],
			packageManager: context.options.package,
      dev: true
    })
    await editFiles({
      title: 'Add scripts to package.json',
      files: 'package.json',
      operations: {
        type: 'edit-json',
        replace: (json, _omit) => ({
          ...json,
          scripts: {
            ...json.scripts,
            'cz': 'cz',
            'release:major': 'standard-version --release-as major --no-verify',
            'release:minor': 'standard-version --release-as minor --no-verify',
            'release:patch': 'standard-version --release-as patch --no-verify'
          },
					"config": {
						"commitizen": {
							"path": "cz-conventional-changelog"
						}
					},
					"commitlint": {
						"extends": ["@commitlint/config-conventional"]
					}
        })
      }
    })
		await executeCommand({
			title: 'Activate git hook',
			command: 'npx',
			arguments: ['husky', 'install']
		})
		await executeCommand({
			title: 'Add pre-commit git hook',
			command: 'npx',
			arguments: ['husky', 'add', '.husky/commit-msg', 'npx --no -- commitlint --edit']
		})
  }
})
