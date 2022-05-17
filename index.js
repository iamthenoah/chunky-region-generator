'use strict'

const Generator = require('./lib/generator')
const { homedir } = require('os')
const path = require('path')
const assert = require('assert')

const defaultOptions = {
	chunkyHome: path.join(homedir(), '.chunky'),
	outputPath: path.join(homedir(), 'Downloads'),
	sceneName: 'scene',
	mcVersion: '1.18.2',
	notifyWhenDone: false,
	chunkyVerbose: false
}

const createGenerator = configs => {
	assert(configs.chunkyLauncher, 'Missing `chunkyLauncher`. Should be the path of the Chunky launcher jar file.')
	assert(configs.regionSize, 'Missing `regionSize`. Should be the size of a region in chunks.')
	assert(configs.totalCount, 'Missing `totalCount`. Should be the total amount of regions.')

	// apply default generator configs if missing
	Object.entries(defaultOptions).forEach(([k, v]) => (configs[k] = configs[k] ?? v))

	return new Generator(
		configs.chunkyHome,
		configs.chunkyLauncher,
		configs.outputPath,
		configs.sceneName,
		configs.regionSize,
		configs.totalCount,
		configs.mcVersion,
		configs.metadataOptions,
		configs.notifyWhenDone,
		configs.chunkyVerbose
	)
}

module.exports = { Generator, createGenerator }
