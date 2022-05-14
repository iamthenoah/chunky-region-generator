'use strict'

const formatConventionalData = (index, metadataOptions, biomes) => {
	const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

	let attributes = []
	for (const biome of biomes) {
		attributes.push({
			trait_type: 'Biome',
			value: capitalize(biome.displayName)
		})
		attributes.push({
			trait_type: 'Precipitation',
			value: capitalize(biome.precipitation)
		})
	}

	const avgTemp = biomes.map(b => b.temperature).reduce((a, b) => a + b) / biomes.length
	const avgRainfall = biomes.map(b => b.rainfall).reduce((a, b) => a + b) / biomes.length

	attributes.push({
		trait_type: 'Avg. Temperature',
		display_type: 'number',
		value: avgTemp.toFixed(1)
	})
	attributes.push({
		trait_type: 'Avg. Rainfall',
		display_type: 'number',
		value: avgRainfall.toFixed(1)
	})

	attributes = attributes.filter((v, i) => i === attributes.findIndex(o => JSON.stringify(o) === JSON.stringify(v)))

	const { description, external_url, image_url } = metadataOptions
	const image = image_url.replace('%', index)

	return { image, description, external_url, attributes }
}

module.exports = { formatConventionalData }
