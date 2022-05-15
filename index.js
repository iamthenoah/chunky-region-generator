const Generator = require('./src/generator')

const main = async configs => {
	const generator = new Generator(
		configs.chunkyHome,
		configs.chunkyLauncher,
		configs.outputPath,
		configs.sceneName,
		configs.resgionSize,
		configs.totalCount,
		{
			description: 'This is a description',
			external_url: 'http://example.com',
			image_url: 'ipfs://QmSq1iNxbGbi8WRDY7VnyyC3LnFEXY298rHbXwgfbKG64M/%.png'
		}
	)

	await generator.generateMetadata(1)
	await generator.generateImage(1)
}

main(require('./temp/configs.json'))
