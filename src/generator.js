'use strict'

const Chunky = require('./chunky')
const Regions = require('./regions')
const { writeFile } = require('fs/promises')
const { formatConventionalData } = require('./util/data')
const path = require('path')

module.exports = class Generator {
	constructor(chunkyHome, chunkyPath, sceneDir, regionSize, totalCount) {
		this.chunky = new Chunky(chunkyPath, sceneDir, true)
		this.regions = new Regions(chunkyHome, '1.18.2', regionSize, totalCount)
		this.regionSize = regionSize
	}

	setMetadataOptions(options) {
		this.metadataOptions = options
	}

	async generateImage(index, outPath) {
		const { x, z } = this.regions.calculateRegionCoordinates(index)

		const chunks = []
		for (let i = 0; i < this.regionSize; i++) {
			for (let j = 0; j < this.regionSize; j++) {
				chunks.push([x + i, z + j])
			}
		}

		const options = {}
		options['renderTime'] = 0
		options['chunkList'] = chunks
		options['camera.position.x'] = x * 16 + (this.regionSize * 16) / 2
		options['camera.position.z'] = z * 16 + (this.regionSize * 16) / 2

		await this.chunky.updateSceneData(options)
		await this.chunky.renderScene()
		await this.chunky.saveRender(path.join(outPath, index))
	}

	async generateMetadata(index, outPath) {
		if (!this.metadataOptions) {
			throw new Error('Metadata options not set.')
		}

		const name = index // TODO - namingScheme
		const bounds = this.regions.getRegionBounds(index)
		const biomes = await this.regions.getRegionBiomesAt(index)
		const land = { bounds, biomes }

		const conventionalData = formatConventionalData(index, this.metadataOptions, biomes)
		const metadata = { name, ...conventionalData, land }

		await writeFile(path.join(outPath, index.toString()), JSON.stringify(metadata, null, 4))
	}
}
