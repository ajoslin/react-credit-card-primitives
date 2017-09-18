const React = require('react')
const PropTypes = require('prop-types')
const Card = require('creditcards/card')
const Types = require('creditcards-types')

const { callAll, INPUT_TYPE } = require('./util')
const AUTOCOMPLETE = 'cardnumber'
const NAME = 'cc-number'

module.exports = exports.default = class CreditCardPrimitive extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    render: PropTypes.func.isRequired,
    cardTypes: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(Types.types)))
  }

  static defaultProps = {
    cardTypes: [],
    onChange: () => {}
  }

  state = {
    value: ''
  }

  isControlled () {
    return this.props.value !== undefined
  }

  getValue (value) {
    return value !== undefined
      ? value
      : (this.isControlled() ? this.props.value : this.state.value)
  }

  isValid (value = this.getValue()) {
    if (!this.props.cardTypes.length) {
      return Card.isValid(value)
    }
    return this.props.cardTypes.some(type => Card.isValid(value, type))
  }

  setValue = (value = '') => {
    if (value) {
      // parse -> format -> parse to truncate invalid card patterns
      value = Card.parse(Card.format(Card.parse(value)))
    }

    if (this.isControlled()) {
      this.props.onChange(this.getStateAndHelpers({ value }))
    } else {
      this.setState({ value }, () => {
        this.props.onChange(this.getStateAndHelpers())
      })
    }
  }

  handleChange = ev => this.setValue(ev.target.value)

  getInputProps = (props = {}) => ({
    ...props,
    name: NAME,
    autoComplete: AUTOCOMPLETE,
    type: INPUT_TYPE,
    placeholder: 'Card number',
    pattern: '[0-9]*',
    value: Card.format(this.getValue(props.value)),
    onChange: callAll(props.onChange, this.handleChange)
  })

  getStateAndHelpers (props = {}) {
    const value = this.getValue(props.value)
    return {
      value,
      valid: this.isValid(props.value),
      type: Card.type(value, true),
      setValue: this.setValue,
      getInputProps: this.getInputProps
    }
  }

  render () {
    return this.props.render(this.getStateAndHelpers())
  }
}
