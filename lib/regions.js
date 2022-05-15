'use strict'

const path = require('path')

module.exports = class Regions {
	constructor(chunkyHome, mcVersion, regionSize, totalCount) {
		this.regionSize = regionSize
		this.areaLength = Math.sqrt(totalCount)

		const registry = require('prismarine-registry')(mcVersion)
		const Anvil = require('prismarine-provider-anvil').Anvil(mcVersion)

		const settings = require(path.join(chunkyHome, 'chunky.json'))
		this.anvil = new Anvil(settings.lastWorld + '/region')
		this.Biome = require('prismarine-biome')(registry)
	}

	calculateRegionCoordinates(index) {
		index -= 1
		const xt = index < this.areaLength ? index : index % (Math.floor(index / this.areaLength) * this.areaLength)
		const zt = index < this.areaLength ? 0 : Math.floor(index / this.areaLength)
		const x = -((this.regionSize * this.areaLength) / 2) - this.regionSize + (xt + 1) * this.regionSize
		const z = -((this.regionSize * this.areaLength) / 2) + zt * this.regionSize
		return { x, z }
	}

	async getRegionBiomes(index) {
		const { x, z } = this.calculateRegionCoordinates(index)
		return await this.getRegionBiomesAt(x, z)
	}

	getRegionBounds(index) {
		const { x, z } = this.calculateRegionCoordinates(index)
		return this.getRegionBoundsAt(x, z)
	}

	async getRegionBiomesAt(x, z) {
		let biomes = []

		for (let i = 0; i < this.regionSize; i++) {
			for (let j = 0; j < this.regionSize; j++) {
				const pos = {
					x: this.regionSize * x + j,
					z: this.regionSize * z + i
				}

				const chunk = await this.anvil.load(x + j, z + i)
				const biome = chunk.getBiome(pos)

				if (!biomes.includes(biome)) {
					biomes.push(biome)
				}
			}
		}

		return biomes.map(this.Biome)
	}

	getRegionBoundsAt(x, z) {
		const chunks = [
			[x, z],
			[x + this.regionSize - 1, z + this.regionSize - 1]
		]
		const blocks = [
			[this.regionSize * x, this.regionSize * z],
			[this.regionSize * x + this.regionSize ** 2 - 1, this.regionSize * z + this.regionSize ** 2 - 1]
		]
		return { chunks, blocks }
	}
}
