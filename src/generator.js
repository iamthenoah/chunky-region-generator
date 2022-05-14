'use strict'

const Chunky = require('./chunky')

module.exports = class Generator {
	constructor(chunkyPath, scenePath) {
		this.chunky = new Chunky(chunkyPath, scenePath, true)
		this.scene = scenePath
	}

	setMetadataOptions(options) {
		this.metadataOptions = options
	}

	async generateImage(index, outPath) {}

	async generateMetadata(index, outPath) {
		if (!this.metadataOptions) {
			throw new Error('Metadata options not set.')
		}
	}
}
