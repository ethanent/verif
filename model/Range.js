module.exports = class Range {
	constructor (min = null, max = null, inclusive = true) {
		if (typeof min === 'number' && typeof max === 'number' && min > max) {
			throw new Error('Bad range: Min ' + min + ' > Max ' + max)
		}

		this.min = min
		this.max = max
		this.inclusive = inclusive
	}

	test (value) {
		if (typeof this.min === 'number') {
			if (this.inclusive ? value < this.min : value <= this.min) {
				return false
			}
		}

		if (typeof this.max === 'number') {
			if (this.inclusive ? value > this.max : value >= this.max) {
				return false
			}
		}

		return true
	}

	toString () {
		return (this.inclusive ? '[' : '(') + this.min + ', ' + this.max + (this.inclusive ? ']' : ')')
	}
}