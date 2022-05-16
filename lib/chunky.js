'use strict'

const { promisify } = require('util')
const { exec } = require('child_process')
const { writeFile } = require('fs/promises')
const path = require('path')
const shell = promisify(exec)

module.exports = class Chunky {
	constructor(chunkyLauncher, chunkyHome, sceneName, verbose = false) {
		this.sceneJson = path.join(chunkyHome, 'scenes', sceneName, sceneName + '.json')
		this.sceneName = sceneName
		this.chunkyLauncher = chunkyLauncher
		this.verbose = verbose
	}

	async updateSceneData(options) {
		const json = require(this.sceneJson)
		Object.entries(options).forEach(([k, v]) => (json[k] = v))
		await writeFile(this.sceneJson, JSON.stringify(json, null, 4))
	}

	async renderScene(outPath) {
		await this.do(`-reload-chunks -render ${this.sceneJson}`)
		await this.do(`-snapshot ${this.sceneName} ${outPath}`)
	}

	async do(something) {
		const { stdout, stderr } = await shell(`java -jar ${this.chunkyLauncher} ${something}`)
		if (this.verbose && stdout) console.log(stdout)
		if (this.verbose && stderr) console.log(stderr)
	}
}
