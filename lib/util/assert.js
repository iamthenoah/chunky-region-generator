'use strict'

module.exports = (condition, message) => {
	if (!condition) {
		throw message instanceof Error ? message : new Error(message)
	}
}
