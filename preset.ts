export default definePreset({
  name: 'commitisem',
	postInstall: ({ hl }) => [
		`This preset has added/ updated ${hl('package.json')} & ${hl('.husky')} (also lock file depends on your package manager)`,
		``,
		`Use ${hl('npx cz')} instead of ${hl('git commit')} when commiting (alt: ${hl('yarn cz')} or ${hl('pnpm cz')})`,
		``,
		`${hl('CHANGELOG.md')} will be generated once you release a new version using ${hl('npm run release:(major|minor|patch)')}`,
	],
  handler: async (context) => {
    await extractTemplates({
      title: 'Extract config files',
			extractDotFiles: true
    })
    await installPackages({
      title: 'Installing packages',
      for: 'node',
      packages: [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        '@commitlint/cz-commitlint',
        'commitizen',
        'husky',
        'inquirer@8.2.4',
        'standard-version'
      ],
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
