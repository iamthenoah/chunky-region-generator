'use strict'

const { promisify } = require('util')
const { exec } = require('child_process')
const { readFile, writeFile, rm } = require('fs/promises')
const flatten = require('./util/flatten')
const path = require('path')
const shell = promisify(exec)

module.exports = class Chunky {
	constructor(chunkyPath, sceneDir, verbose) {
		this.chunkyPath = chunkyPath
		this.sceneDir = sceneDir
		this.verbose = verbose
	}

	async updateSceneData(options) {
		const opts = { force: true, recursive: true }
		const snapshots = path.join(this.sceneDir, 'snapshots')
		await rm(snapshots, opts)

		const sceneName = this.sceneDir.substring(this.sceneDir.lastIndexOf('\\') + 1)
		const sceneOptionFile = path.join(this.sceneDir, sceneName + '.json')
		const buffer = await readFile(sceneOptionFile)
		const json = JSON.parse(buffer.toString())

		// override all matching keys with its `options` value
		Object.entries(flatten(options)).forEach(([k, v]) => (json[k] = v))

		await writeFile(sceneOptionFile, JSON.stringify(json, null, 4))
	}

	async renderScene() {
		const sceneName = this.sceneDir.substring(this.sceneDir.lastIndexOf('\\') + 1)
		const scenePath = path.join(this.sceneDir, sceneName + '.json')
		await this.do(`-reload-chunks -render ${scenePath}`)
	}

	async saveRender(outPath) {
		await this.do(`-snapshot ${this.sceneDir} ${outPath}`)
	}

	async updateMcVersion(version) {
		await this.do(`-download-mc ${version}`)
	}

	async do(something) {
		const { stdout, stderr } = await shell(`java -jar ${this.chunkyPath} ${something}`)
		if (this.verbose && stdout) console.log(stdout)
		if (this.verbose && stderr) console.log(stderr)
	}
}
