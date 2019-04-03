# verif
> Secure data validation in JS

## Install

```
npm i verif
```

```js
const {Validator, Range}
```

## Usage

### Create a validator

```js
const myValidator = new Validator({
	'type': 'object',
	'props': {
		'name': {
			'type': 'string',
			'length': Range(3, 23)
		},
		'age': {
			'type': 'number',
			'value': Range(5, 4000)
		}
	}
})
```

### Test with a validator

```js
myValidator.test({
	'name': 'Tester',
	'age': 17
})

// This will not throw; data is acceptable.
```

```js
myValidator.test({
	'name': 'Tester',
	'age': 4
})

// This will throw an error:
// Error: Number value 4 out of bounds. Expected in [5, 4000]
```

### Validate with a validator

```js
const res = myValidator.validate({
	'name': 'Tester',
	'age': 4
})

// This will return information about the validation:
/*
{
	passed: false,
	message: 'Number value 4 out of bounds. Expected in [5, 4000]',
	path: '/age/'
}
*/
```

## Properties of types

For all validations, a `type` must be specified.

### number

- `Range` value
	Permitted number value range

### string

- `Range` length
	Permitted string length range

- `RegEx` test
	Mandatory string regular expression test

### array

- `Range` length
	Permitted array length range

- `schema` items
	Schema for item testing

### object

- `Object[schema]` props
	Schemas for testing individual properties

- `boolean` allowExtraProps
	Permit the inclusion of additional properties not defined in `props`
	Default: `false`
