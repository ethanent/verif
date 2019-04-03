const {Validator, Range} = require(__dirname)

const w = require('whew')

w.add('Verify complex data', (res) => {
	const testV = new Validator({
		'type': 'object',
		'props': {
			'a': {
				'type': 'string',
				'length': Range(3, 5)
			},
			'b': {
				'type': 'array',
				'items': {
					'type': 'number',
					'value': Range(5, 8, true)
				}
			}
		}
	})

	testV.test({
		'a': 'heyy',
		'b': [6, 7, 6]
	})

	res(true)
})

w.add('Validate string length', (res) => {
	const testV = new Validator({
		'type': 'string',
		'length': Range(7, 9)
	})

	testV.test('qqqqqqq')

	if (testV.validate({}).passed === true || testV.validate('qqqqqq').passed === true) {
		res(false, 'Unexpected passage.')
	}
	else {
		res(true, 'Properly handled bad data.')
	}
})

w.add('Validate array length and items', (res) => {
	const testV = new Validator({
		'type': 'array',
		'length': Range(3, 4),
		'items': {
			'type': 'number',
			'value': Range(2, 5)
		}
	})

	testV.test([3, 4, 5, 2])

	if (testV.validate({}).passed === true || testV.validate([2, 3]).passed === true || testV.validate([2, 3, 8]).passed === true) {
		res(false, 'Unexpected passage.')
	}
	else {
		res(true, 'Properly handled bad data.')
	}
})

w.test()