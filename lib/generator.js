'use strict'

const Chunky = require('./chunky')
const Regions = require('./regions')
const { writeFile } = require('fs/promises')
const { formatConventionalData } = require('./util/data')
const path = require('path')

module.exports = class Generator {
	constructor(
		chunkyHome,
		chunkyLauncher,
		outputPath,
		sceneName,
		regionSize,
		totalCount,
		metadataOptions = undefined
	) {
		this.chunky = new Chunky(chunkyLauncher, chunkyHome, sceneName, true)
		this.regions = new Regions(chunkyHome, '1.18.2', regionSize, totalCount)
		this.outputPath = outputPath
		this.regionSize = regionSize
		this.metadataOptions = metadataOptions
	}

	async generateImage(index) {
		await this.generateImage(index, this.outputPath)
	}

	async generateMetadata(index) {
		await this.generateMetadata(index, this.outputPath)
	}

	async generateImage(index, outPath) {
		const { x, z } = this.regions.calculateRegionCoordinates(index)

		const chunks = []
		for (let i = 0; i < this.regionSize; i++) {
			for (let j = 0; j < this.regionSize; j++) {
				chunks.push([x + i, z + j])
			}
		}

		// options to change in scenes/<scene>/<scene>.json
		// `chunkList`          => list of chunks to render
		// `camera.position`    => x & z position of camera
		const options = {
			chunkList: chunks,
			camera: {
				position: {
					x: x * 16 + (this.regionSize * 16) / 2,
					z: z * 16 + (this.regionSize * 16) / 22
				}
			}
		}

		await this.chunky.updateSceneData(options)
		await this.chunky.renderScene(path.join(outPath, index.toString()))
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
