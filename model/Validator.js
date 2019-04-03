module.exports = class Validator {
	constructor (expect) {
		this.schema = expect
	}

	validate (data, expect = this.schema, path = '/') {
		// Update options for consistency

		if (typeof expect.nullable !== 'boolean') {
			expect.nullable = false
		}

		if (typeof expect.type !== 'string') {
			return {
				'passed': false,
				'message': 'Type must be specified for all validations.',
				'path': path
			}
		}

		// Validate generic checks

		if (data === null) {
			if (expect.nullable) {
				return {
					'passed': true,
					'message': null,
					'path': path
				}
			}
			else {
				return {
					'passed': false,
					'message': 'Missing / null expected property.',
					'path': path
				}
			}
		}

		if (typeof expect.type === 'string') {
			if (expect.type === 'array') {
				if (!Array.isArray(data)) {
					return {
						'passed': false,
						'message': 'Bad type: ' + typeof data + '. Expected array',
						'path': path
					}
				}
			}
			else if (typeof data !== expect.type) {
				return {
					'passed': false,
					'message': 'Bad type: ' + typeof data + '. Expected ' + expect.type,
					'path': path
				}
			}
		}

		// Type-specific checks

		if (expect.type === 'array') {
			if (typeof expect.length === 'object') {
				if (!expect.length.test(data.length)) {
					return {
						'passed': false,
						'message': 'Array length ' + data.length + ' invalid. Expected length in ' + expect.length.toString(),
						'path': path
					}
				}
			}

			if (typeof expect.items === 'object') {
				for (let i = 0; i < data.length; i++) {
					const vresult = this.validate(data[i], expect.items, path + '[' + i + ']' + '/')

					if (!vresult.passed) {
						return vresult
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
							const vresult = this.validate(data[keys[i]], expect.props[keys[i]], path + keys[i] + '/')

							if (vresult.passed === false) {
								return vresult
							}
						}
						else {
							return {
								'passed': false,
								'message': 'Unexpected key \'' + keys[i] + '\'',
								'path': path
							}
						}
					}
				}

				const expectPropNames = Object.keys(expect.props)

				for (let i = 0; i < expectPropNames.length; i++) {
					// Doesn't check if current prop is nullable because its prop still should exist as null if null

					if (!data.hasOwnProperty(expectPropNames[i])) {
						return {
							'passed': false,
							'message': 'Missing key \'' + expectPropNames[i] + '\'',
							'path': path
						}
					}
				}
			}
		}
		else if (expect.type === 'string') {
			if (typeof expect.length === 'object') {
				if (!expect.length.test(data.length)) {
					return {
						'passed': false,
						'message': 'String length ' + data.length + ' out of bounds. Expected length in ' + expect.length.toString(),
						'path': path
					}
				}
			}

			if (typeof expect.test === 'object') {
				if (!expect.test.test(data)) {
					return {
						'passed': false,
						'message': 'String failed regular expression test.',
						'path': path
					}
				}
			}
		}
		else if (expect.type === 'number') {
			if (typeof expect.value === 'object') {
				if (!expect.value.test(data)) {
					return {
						'passed': false,
						'message': 'Number value ' + data + ' out of bounds. Expected in ' + expect.value.toString(),
						'path': path
					}
				}
			}
		}

		return {
			'passed': true,
			'message': null,
			'path': null
		}
	}

	test (data) {
		const vresult = this.validate(data)

		if (vresult.passed === true) {
			return true
		}
		else {
			const err = new Error(vresult.message)

			err.path = vresult.path

			throw err
		}
	}
}