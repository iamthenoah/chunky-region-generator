'use strict'

const { ArgumentParser } = require('argparse')
const { createGenerator } = require('./index')

const parser = new ArgumentParser({
	description: 'Chunky Region Generator CLI'
})

parser.add_argument('--what', '-w', {
	help: `Specify what to generate.`,
	choices: ['metadata', 'image'],
	required: true
})
parser.add_argument('--configs', '-c', {
	help: `Specify the path the generator's config file.`,
	required: true
})
parser.add_argument('--index', '-i', {
	help: `Specify which region to focus on. (non zero-based)`
})
parser.add_argument('--all', '-a', {
	help: `Specify whether to generate all regions.`
})

const main = async args => {
	const configs = require(args.configs)
	const generator = createGenerator(configs)
	const method = 'generate' + args.what.charAt(0).toUpperCase() + args.what.slice(1)

	if (args.all) {
		for (let i = 1; i <= configs.totalCount; i++) {
			await generator[method](i)
		}
	} else {
		await generator[method](args.index)
	}
}

main(parser.parse_args())
