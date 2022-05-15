'use strict'

const Chunky = require('./chunky')
const Regions = require('./regions')
const { writeFile } = require('fs/promises')
const { formatConventionalData } = require('./util/metadata')
const path = require('path')
const sound = require('sound-play')

module.exports = class Generator {
	constructor(
		chunkyHome,
		chunkyLauncher,
		outputPath,
		sceneName,
		regionSize,
		totalCount,
		mcVersion,
		metadataOptions = undefined,
		notifyWhenDone = false
	) {
		this.chunky = new Chunky(chunkyLauncher, chunkyHome, sceneName, true)
		this.regions = new Regions(chunkyHome, mcVersion, regionSize, totalCount)
		this.outputPath = outputPath
		this.regionSize = regionSize
		this.metadataOptions = metadataOptions
		this.notifyWhenDone = notifyWhenDone
	}

	async generateImage(index) {
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
		const saveAs = path.join(this.outputPath, index + '.png')
		await this.chunky.renderScene(saveAs)

		if (this.notifyWhenDone) {
			sound.play(path.join(process.cwd(), 'assets', 'orb.mp3'))
		}
	}

	async generateMetadata(index) {
		if (!this.metadataOptions) {
			throw new Error('Metadata options not set.')
		}

		const name = this.metadataOptions.namingScheme.replace('%', index)
		const bounds = this.regions.getRegionBounds(index)
		const biomes = await this.regions.getRegionBiomes(index)
		const land = { bounds, biomes }

		const conventionalData = formatConventionalData(index, this.metadataOptions, biomes)
		const metadata = { name, ...conventionalData, land }

		const saveAs = path.join(this.outputPath, index.toString())
		await writeFile(saveAs, JSON.stringify(metadata, null, 4))
	}
}
