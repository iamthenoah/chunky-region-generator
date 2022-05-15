'use strict'

const Generator = require('./lib/generator')
const { homedir } = require('os')
const path = require('path')

const defaultOptions = {
	chunkyHome: path.join(homedir(), '.chunky'),
	outputPath: path.join(homedir(), 'Downloads'),
	sceneName: 'scene',
	notifyWhenDone: false
}

const createGenerator = configs => {
	if (!configs.chunkyLauncher) {
		throw new Error('Missing `chunkyLauncher`. Should be the path to the Chunky launcher a jar file.')
	}
	if (!configs.resgionSize) {
		throw new Error('Missing `resgionSize`. Should be the size of a region in chunks.')
	}
	if (!configs.totalCount) {
		throw new Error('missing `totalCount`. Should be the total amount of regions.')
	}

	// apply default generator configs if missing
	Object.entries(defaultOptions).forEach(([k, v]) => (configs[k] = configs[k] ?? v))

	return new Generator(
		configs.chunkyHome,
		configs.chunkyLauncher,
		configs.outputPath,
		configs.sceneName,
		configs.resgionSize,
		configs.totalCount,
		configs.metadataOptions,
		configs.notifyWhenDone
	)
}

module.exports = { Generator, createGenerator }
