const Generator = require('./src/generator')

const main = async configs => {
	const generator = new Generator(
		configs.chunkyHome,
		configs.chunkyPath,
		configs.sceneDir,
		configs.resgionSize,
		configs.totalCount
	)

	// generator.setMetadataOptions({
	// 	description: 'This is a description',
	// 	external_url: 'http://example.com',
	// 	image_url: 'ipfs://QmSq1iNxbGbi8WRDY7VnyyC3LnFEXY298rHbXwgfbKG64M/%.png'
	// })

	// await generator.generateMetadata(25, `C:\\Users\\greff\\Desktop\\chunky-region-generator\\temp\\out`)
	await generator.generateImage(25, `C:\\Users\\greff\\Desktop\\chunky-region-generator\\temp\\out`)
	// await generator.chunky.do('-list-scenes')
}

main(require('./temp/configs.json'))
