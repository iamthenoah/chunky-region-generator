import { Biome } from 'prismarine-biome'

export class Generator {
	constructor(
		chunkyHome: string,
		chunkyLauncher: string,
		outputPath: string,
		sceneName: string,
		regionSize: number,
		totalCount: number,
		notifyWhenDone: boolean | undefined
	)
	readonly chunky: Chunky
	readonly regions: Regions
	generateImage: (index: number) => Promise<void>
	generateMetadata: (index: number, metadataOptions: MetadataOptions, doSave?: boolean) => Promise<RegionMetaData>
}

export class Chunky {
	constructor(chunkyLauncher: string, chunkyHome: string, sceneName: string, verbose: boolean | undefined)
	updateSceneData: (callback: (scene: Record<string, string | number>) => void) => Promise<void>
	renderScene: (outPath: string) => Promise<void>
	do: (something: string | undefined) => Promise<void>
}

export class Regions {
	constructor(chunkyHome: string, mcVersion: string, regionSize: number, totalCount: number)
	calculateRegionCoordinates: (index: number) => { x: number; z: number }
	getRegionBiomes: (index: number) => Promise<Biome[]>
	getRegionBounds: (index: number) => RegionBounds
	getRegionBiomesAt: (x: number, z: number) => Promise<Biome[]>
	getRegionBoundsAt: (x: number, z: number) => RegionBounds
}

export type RegionBounds = {
	chunks: number[][]
	blocks: number[][]
}

export type RegionAttribute = {
	trait_type: string
	display_type?: string
	value: string
}

export type RegionMetadata = {
	name: string
	description: string
	external_url: string
	image: string
	attributes: RegionAttribute[]
	land: {
		biomes: Biome[]
		bounds: RegionBounds
	}
}

export type MetadataOptions = {
	description: string
	external_url: string
	image_url: string
	namingScheme: string
}

export interface GeneratorConfigs {
	chunkyHome?: string
	chunkyLauncher: string
	outputPath?: string
	sceneName?: string
	regionSize: number
	totalCount: number
	notifyWhenDone?: boolean
}

export function createGenerator(configs: GeneratorConfigs): Generator
