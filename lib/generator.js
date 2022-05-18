'use strict'

const Chunky = require('./chunky')
const Regions = require('./regions')
const { writeFile } = require('fs/promises')
const { formatConventionalData } = require('./util/metadata')
const path = require('path')
const sound = require('sound-play')
const assert = require('assert')

module.exports = class Generator {
	constructor(
		chunkyHome,
		chunkyLauncher,
		outputPath,
		sceneName,
		regionSize,
		totalCount,
		mcVersion,
		notifyWhenDone = false,
		chunkyVerbose = false
	) {
		this.chunky = new Chunky(chunkyLauncher, chunkyHome, sceneName, chunkyVerbose)
		this.regions = new Regions(chunkyHome, mcVersion, regionSize, totalCount)
		this.outputPath = outputPath
		this.regionSize = regionSize
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

		await this.chunky.updateSceneData(scene => {
			// options to change in scenes/<scene>/<scene>.json
			// `chunkList`          => list of chunks to render
			// `camera.position`    => x & z position of camera
			scene.chunkList = chunks
			scene.camera.position.x = x * 16 + (this.regionSize * 16) / 2
			scene.camera.position.z = z * 16 + (this.regionSize * 16) / 2
		})
		const saveAs = path.join(this.outputPath, index + '.png')
		await this.chunky.renderScene(saveAs)

		if (this.notifyWhenDone) {
			sound.play(path.join(process.cwd(), 'assets', 'orb.mp3'))
		}
	}

	async generateMetadata(index, metadataOptions, doSave = false) {
		assert(metadataOptions, 'Metadata options not set.')

		const name = metadataOptions.namingScheme.replace('%', index)
		const bounds = this.regions.getRegionBounds(index)
		const biomes = await this.regions.getRegionBiomes(index)
		const land = { bounds, biomes }

		const conventionalData = formatConventionalData(index, metadataOptions, biomes)
		const metadata = { name, ...conventionalData, land }

		if (doSave) {
			const saveAs = path.join(this.outputPath, index.toString())
			await writeFile(saveAs, JSON.stringify(metadata, null, 4))
		}

		return metadata
	}
}
