export default definePreset({
	name: 'commitisem',
	options: {
		// ...
	},
	handler: async() => {
		await extractTemplates()
		// ...
	},
})
