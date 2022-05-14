'use strict'

const flatten = (obj, prefix = '') => {
	return Object.keys(obj).reduce((acc, k) => {
		const pre = prefix.length ? prefix + '.' : ''
		if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
			Object.assign(acc, flatten(obj[k], pre + k))
		} else {
			acc[pre + k] = obj[k]
		}
		return acc
	}, {})
}

module.exports = flatten
