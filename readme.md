# react-credit-card-primitives [![Build Status](https://travis-ci.org/ajoslin/react-stepper-primitive.svg?branch=master)](https://travis-ci.org/ajoslin/react-credit-card-primitives)

> React primitives to build a credit card form.

Relies on the [creditcards](https://github.com/bendrucker/creditcards) library. **Much** is lifted from @bendrucker's [virtual-credit-cards](https://github.com/bendrucker/virtual-credit-cards).

### Install

```
$ npm install --save react-stepper-primitive
```

### Why?

When you need to build a credit card form, it's really hard to find something that is:

- Small bundle size
- Customizable
- Doesn't come with loads of CSS that you don't want to use.

These principles follow the "bring your own render" philosophy, using [prop getters](https://github.com/paypal/downshift/blob/8563d4bae2af19fdc7242c66b551d46396234cf9/README.md#prop-getters) to hand you properties to put on your own elements to render the form.

[Try a demo on Codesandbox]()

### Example

```jsx
import {Number, Cvc, Expiration} from 'react-credit-card-primitives'
ReactDOM.render(
  <div>
    <Number
      onChange={({value, valid}) => console.log(value, valid)}
      render={({
        getInputProps,
        valid
      }) => (
        <input {...getInputProps()} className={valid ? '' : 'error'} />
      )} />
    <Expiration
      onChange={({month, year, valid}) => console.log(month, year, valid)}
      render={({
        getInputProps,
        valid,
        error
      }) => (
        <div>
          <input {...getInputProps()} className={valid ? '' : 'error'} />
          {!value ? ''
            : error === Expiration.ERROR_MONTHYEAR ? 'Please enter valid month and year'
            : error === Expiration.ERROR_MONTH ? 'Please enter valid month'
            : error === Expiration.ERROR_YEAR ? 'Please enter valid year'
            : error === Expiration.ERROR_PAST_DATE ? 'Please enter a date in the future.'
            : ''}
        </div>
      )} />
    <Cvc
      onChange={({value, valid}) => console.log(value, valid)}
      masked={true}
      onChange={({value, valid}) => console.log(value, valid)
      render={({
        getInputProps,
        valid
      }) => (
        <input {...getInputProps()} className={valid ? '' : 'error'} />
      )} />
    />
  </div>,
  document.body
)
```

![](http://ajoslin.co/peMgdk/iDwnPI29+)

## API

### `<Number>`

Create a credit card input that formats the user's input with spaces every four digits. Formats and validates user input with [creditcards.card](https://github.com/bendrucker/creditcards#card).


```js
import {Number} from 'react-credit-card-primitives'
// OR:
import Number from 'react-credit-card-primitives/number'
```
#### Props

#### value

> `string` | optional

The credit card number without spaces (eg `4242424242424242`). The non-formatted version of the user input.

If not provided, the Number component will manage its value via internal state (it will be an "uncontrolled component").

If `value` is provided, the Number component becomes a "controlled component".

The `onChange` prop is called whenever `value` changes.

#### onChange

> `function(object: NumberStateAndHelpers)` | optional

Called when the value changes. `NumberStateAndHelpers` is the same object received by the `render` prop function.

#### cardTypes

> `Array<creditcards-types type id>` | optional

[All `creditcards-types` Type Ids (export keys)](https://github.com/bendrucker/creditcards-types/blob/master/src/types.js)

Example: `<Number cardTypes={['americanExpress', 'visa']} />`

The given types, if provided, will be the only allowed credit card types.

By default, all card types are allowed.

#### render

> `function(object: NumberStateAndHelpers)` | *required*

`<Number render={() => <div />} />`

Use the `render` prop function to render your number input and any associated elements (e.g. an image representing the current card type or any errors).

The `render` prop function is called with the following `NumberStateAndHelpers` object:


| property      | category    | type     | description                                                                                                                                                                                                                                                                               |
|---------------|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| value         | state       | string   | The currently entered credit card number (without spaces or formatting)                                                                                                                                                                                                                   |
| valid         | state       | boolean  | Whether the given `value` is a valid credit card number (via [creditcards.card.isValid](https://github.com/bendrucker/creditcards#cardisvalidnumber-type---boolean). If the `cardTypes` property is passed in, this says whether the value is a valid version of one of those card types. |
| type          | state       | string   | What credit card type the currently entered number is (eg `'visa'`).                                                                                                                                                                                                                      |
| getInputProps | prop getter | function | The properties to put on your `<input>` element.                                                                                                                                                                                                                                          |

### `<Expiration>`

Create an expiration input that automatically puts a separator (` / `) between month and year. Formats and validates user input with [creditcards.expiration](https://github.com/bendrucker/creditcards#expiration).

Provides you with parsed `month` and `year` as numbers.

```js
import {Expiration} from 'react-credit-card-primitives'
// OR:
import Expiration from 'react-credit-card-primitives/expiration'
```

#### Props

#### month

> `number` | optional

The entered month, 1-12.

If not provided, the Expiration component will manage its month via internal state (uncontrolled).

If provided, it must be provided with the `year` prop.

The `onChange` prop is called whenever `month` changes.

#### year

> `number` | optional

The entered year, four digits.

If not provided, the Expiration component will manage its year via internal state.

If provided, it must be provided with the `month` prop.

The `onChange` prop is called whenever `year` changes.

#### onChange

> `function(object: ExpirationStateAndHelpers)`

Called when the month or year changes. `ExpirationStateAndHelpers` is the same object received by the `render` prop function.

#### render

> `function(object: ExpirationStateAndHelpers)` | *required*

`<Expiration render={() => <div />} />`

Use the `render` prop function to render your expiration input and any associated elements (e.g. errors).

The `render` prop function is called with the following `ExpirationStateAndHelpers` object:

| property      | category    | type     | description                                                   |
|---------------|-------------|----------|---------------------------------------------------------------|
| month         | state       | number   | The currently entered month or undefined.                     |
| year          | state       | number   | The currently entered four-digit year or undefined.           |
| rawValue      | state       | string   | The value currently entered into the input (e.g. `'11 / 19'`  |
| error         | state       | string   | The current error, if input is not valid. See `Errors` below. |
| valid         | state       | boolean  | Whether the input is currently a valid month/year.            |
| getInputProps | prop getter | function | The properties to put on your `<input>` element.              |

#### Errors

The possible values for `error` in `ExpirationStateAndHelpers`. These are provided because expiration errors can be of several different types. Use these to display errors in your UI:

- `Expiration.ERROR_MONTH_YEAR` ('err_monthyear')
- `Expiration.ERROR_MONTH` ('err_month')
- `Expiration.ERROR_YEAR` ('err_year')
- `Expiration.ERROR_PAST_DATE` ('err_pastdate')

### `<Cvc>`

Create a cvc input. Validates user input with [creditcards.cvc](https://github.com/bendrucker/creditcards#cvc).

Allows masking (while blurred, input becomes type="password").

```js
import {Cvc} from 'react-credit-card-primitives'
// OR:
import Cvc from 'react-credit-card-primitives/cvc'
```

#### Props

#### value

> `string` | optional

The entered cvc number.

If not provided, the Cvc component will manage its value via internal state (uncontrolled component).

If `value` is provided, the Cvc component becomes a "controlled component".

The `onChange` prop is called whenever `value` changes.


#### masked

> `boolean` | optional

If true, the input will become type `password` while blurred, masking the user's cvc input.

#### cardType

> `string<creditcards-types type id>`

A creditcards-types type id is one of [these keys](https://github.com/bendrucker/creditcards-types/blob/master/src/types.js).

By default, the cvc input will be validated as needing to be of length 3 or 4.

If a type id is given, the cvc input must match the length of the given type.

For example, the following will validate the length as 4 for american express cards:

```js
<Cvc cardType='americanExpress' />
```

#### onChange

> `function(object: CvcStateAndHelpers)` | optional

Called when the value changes. `CvcStateAndHelpers` is the same object received by the `render` prop function.

#### render

> `function(object: CvcStateAndHelpers)` | *required*

`<Cvc render={() => <div />} />`

Use the `render` prop function to render your cvc input and any associated elements (e.g. errors).

The `render` prop function is called with the following `CvcStateAndHelpers` object:

| property      | category    | type     | description                                                                                            |
|---------------|-------------|----------|--------------------------------------------------------------------------------------------------------|
| value         | state       | string   | The currently entered cvc code                                                                         |
| focused       | state       | boolean  | Whether the cvc input is focused                                                                       |
| valid         | state       | boolean  | Whether the cvc input is valid. If `cardType` is provided, the cvc is validated against that cardType. |
| getInputProps | prop getter | function | The properties to put on your `<input>` element.                                                       |

## License

MIT © [Andrew Joslin](http://ajoslin.com)