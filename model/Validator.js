module.exports = class Validator {
	constructor (expect) {
		this.schema = expect
	}

	error (message, path) {
		const err = new Error(message + '\nAt: ' + path)

		err.shortMessage = message

		err.path = path

		return err
	}

	validate (data, expect = this.schema, path = '/') {
		// Update options for consistency

		if (typeof expect.nullable !== 'boolean') {
			expect.nullable = false
		}

		if (typeof expect.type !== 'string') {
			throw this.error('Type must be specified for all validations.', path)
		}

		// Validate generic checks

		if (data === null) {
			if (expect.nullable) {
				return true
			}
			else {
				throw this.error('Missing / null expected property.', path)
			}
		}

		if (typeof expect.type === 'string') {
			if (expect.type === 'array') {
				if (!Array.isArray(data)) {
					throw this.error('Bad type: ' + typeof data + '. Expected array', path)
				}
			}
			else if (typeof data !== expect.type) {
				throw this.error('Bad type: ' + typeof data + '. Expected ' + expect.type, path)
			}
		}

		// Type-specific checks

		if (expect.type === 'array') {
			if (typeof expect.length === 'object') {
				if (!expect.length.test(data.length)) {
					throw this.error('Array length ' + data.length + ' invalid. Expected length in ' + expect.length.toString(), path)
				}
			}

			if (typeof expect.items === 'object') {
				for (let i = 0; i < data.length; i++) {
					try {
						this.validate(data[i], expect.items, path + '[' + i + ']' + '/')
					}
					catch (err) {
						throw err
					}
				}
			}
		}
		else if (expect.type === 'object') {
			if (typeof expect.props === 'object') {
				if (typeof expect.allowExtraProps !== 'boolean' || expect.allowExtraProps === false) {
					const keys = Object.keys(data)

					for (let i = 0; i < keys.length; i++) {
						if (expect.props.hasOwnProperty(keys[i])) {
							try {
								this.validate(data[keys[i]], expect.props[keys[i]], path + keys[i] + '/')
							}
							catch (err) {
								throw err
							}
						}
						else throw this.error('Unexpected key \'' + keys[i] + '\'', path)
					}
				}

				const expectPropNames = Object.keys(expect.props)

				for (let i = 0; i < expectPropNames.length; i++) {
					// Doesn't check if current prop is nullable because its prop still should exist as null if null

					if (!data.hasOwnProperty(expectPropNames[i])) {
						throw this.error('Missing key \'' + expectPropNames[i] + '\'', path)
					}
				}
			}
		}
		else if (expect.type === 'string') {
			if (typeof expect.length === 'object') {
				if (!expect.length.test(data.length)) {
					throw this.error('String length ' + data.length + ' out of bounds. Expected length in ' + expect.length.toString(), path)
				}
			}

			if (typeof expect.test === 'object') {
				if (!expect.test.test(data)) {
					throw this.error('String failed regular expression test.', path)
				}
			}
		}
		else if (expect.type === 'number') {
			if (typeof expect.value === 'object') {
				if (!expect.value.test(data)) {
					throw this.error('Number value ' + data + ' out of bounds. Expected in ' + expect.value.toString(), path)
				}
			}
		}

		return true
	}
}