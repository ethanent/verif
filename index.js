const Range = require('./model/Range.js')

module.exports = {
	'Range': (a, b, c) => new Range(a, b, c),
	'Validator': require('./model/Validator.js')
}