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

const main = async args => {
	const configs = require(args.configs)
	const generator = createGenerator(configs)
	const method = 'generate' + args.what.charAt(0).toUpperCase() + args.what.slice(1)

	if (args.index) {
		await generator[method](args.index)
	} else {
		for (let i = 1; i <= configs.totalCount; i++) {
			await generator[method](i)
		}
	}
}

main(parser.parse_args())
