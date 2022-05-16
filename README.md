<div align="center">
    <h1>Minecraft NFT Region Generator</h1>
    <img src="assets/region1.png" alt="Logo" width="30%">
    <img src="assets/region2.png" alt="Logo" width="30%">
    <img src="assets/region3.png" alt="Logo" width="30%">
</div>

##

### Prerequisite

-   [Chunky](https://chunky-dev.github.io/docs/) launch installed.
-   A minecraft world with loaded chunks.

### Usage

```js
import { createGenerator } from 'chunky-region-generator'

const generator = createGenerator({}) // configs

for (let i = 1; i <= 100; i++) {
	await generator.generateImage(i) // generate images for 100 regions
}
```

### Configs

| Option                         | Description                                             |   Default   |
| ------------------------------ | :------------------------------------------------------ | :---------: |
| `chunkyHome`                   | The path that points to the Chunky home directory       | `/.chunky`  |
| `chunkyLauncher`               | The path of the Chunky launch jar file                  |             |
| `outputPath`                   | Output file for the generated content                   | `Downloads` |
| `sceneName`                    | The scene of the name to render from                    |   `scene`   |
| `mcVersion`                    | The Minecraft version (used for Biomes)                 |  `1.18.2`   |
| `regionSize`                   | The size of a region in chunks (eg. 8 will be 8x8)      |             |
| `totalCount`                   | The total amount of regions to render                   |             |
| `notifyWhenDone`               | Whether to log Chunky's output                          |   `false`   |
| `metadataOptions.description`  | The Nft project's description.                          |             |
| `metadataOptions.external_url` | Any external url for the Nft's project,                 |             |
| `metadataOptions.image_url`    | The external URL where the images are uploaded          |             |
| `metadataOptions.namingScheme` | The naming scheme to follow (replaces '%' with number ) |             |

### Using the CLI

The generator can also be used via the CLI.

#### Arguments

| Option      | Description                                                 | Required |
| ----------- | :---------------------------------------------------------- | :------: |
| `--what`    | Tell the CLI what to do, can be either 'image' or 'metadata |  `true`  |
| `--configs` | The path of the configuration file (as described above).    |  `true`  |
| `--index`   | Whether to generate for a specific region (non zero-based)  | `false`  |

#### Examples

###### To generate metadata for region #8

```
node cli.js -w metadata -c path\to\configs.json -i 8
```

###### To generate images for all regions

```
node cli.js -w image -c path\to\configs.json
```
