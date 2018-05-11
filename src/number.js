const React = require('react')
const PropTypes = require('prop-types')
const Card = require('creditcards/card')

const { callAll, INPUT_TYPE } = require('./util')
const AUTOCOMPLETE = 'cardnumber'
const NAME = 'cc-number'
const MASK_CHAR = '•'

module.exports = exports.default = class NumberPrimitive extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    render: PropTypes.func.isRequired,
    masked: PropTypes.bool,
    getMaskedValue: PropTypes.func,
    cardTypes: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    cardTypes: [],
    masked: false,
    // By default, mask all but last4.
    getMaskedValue: ({value, valid}) => {
      if (!valid) return Card.format(value)
      return Card.format(value)
        .split(' ')
        .map((group, index, array) => {
          return index === array.length - 1
            ? group
            : group.replace(/./g, MASK_CHAR)
        })
        .join(' ')
    },
    onChange: () => {}
  }

  state = {
    value: this.props.defaultValue || '',
    focused: false
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

  handleFocus = ev => this.setState({ focused: true })
  handleBlur = ev => this.setState({ focused: false })
  handleChange = ev => this.setValue(ev.target.value)

  getInputProps = (props = {}) => {
    const value = this.getValue(props.value)
    return {
      ...props,
      'aria-invalid': value
        ? String(!this.isValid(value))
        : value,
      name: NAME,
      autoComplete: AUTOCOMPLETE,
      type: INPUT_TYPE,
      placeholder: 'Card number',
      pattern: '[0-9]*',
      value: (this.props.masked && !this.state.focused)
        ? this.props.getMaskedValue(this.getStateAndHelpers(props))
        : Card.format(this.getValue(props.value)),
      onFocus: callAll(props.onFocus, this.handleFocus),
      onBlur: callAll(props.onBlur, this.handleBlur),
      onChange: callAll(props.onChange, this.handleChange)
    }
  }

  getLabelProps = (props = {}) => ({
    ...props,
    htmlFor: NAME
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
