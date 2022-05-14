'use strict'

const { promisify } = require('util')
const flatten = require('./util/flatten')
const { exec } = require('child_process')
const { readFile, writeFile, rm } = require('fs/promises')
const path = require('path')
const shell = promisify(exec)

module.exports = class Chunky {
	constructor(chunkyPath, scenePath, verbose) {
		this.chunkyPath = chunkyPath
		this.scenePath = scenePath
		this.verbose = verbose
	}

	async updateSceneData(options) {
		const sceneOptionFile = path.join(sceneDir, 'scene.json')
		const buffer = await readFile(sceneOptionFile)
		const json = JSON.parse(buffer.toString())

		// override all matching keys with its `options` value
		Object.entries(flatten(options)).forEach(([k, v]) => (json[k] = v))

		await writeFile(sceneOptionFile, JSON.stringify(json, null, 4), () => {})
	}

	async cleanupScene() {
		const opts = { force: true, recursive: true }
		const snapshots = path.join(this.scenePath, 'snapshots')
		await rm(snapshots, opts)
	}

	async reloadChunks() {
		await this.do('-reload-chunks')
	}

	async renderScene() {
		await this.do(`-render ${this.scenePath}`)
	}

	async saveRender(outPath) {
		await this.do(`-snapshot ${this.scenePath} ${outPath}`)
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
