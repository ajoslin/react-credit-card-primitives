const React = require('react')
const PropTypes = require('prop-types')
const creditcards = require('creditcards')
const find = require('array-find')

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
    cardTypes: PropTypes.arrayOf(PropTypes.string),
    creditcards: PropTypes.object
  }

  static defaultProps = {
    cardTypes: [],
    masked: false,
    creditcards,
    onChange: () => {}
  }

  getMaskedValue ({value, valid}) {
    if (!valid) return this.props.creditcards.card.format(value)
    return this.props.creditcards.card.format(value)
      .split(' ')
      .map((group, index, array) => {
        return index === array.length - 1
          ? group
          : group.replace(/./g, MASK_CHAR)
      })
      .join(' ')
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
      return this.props.creditcards.card.isValid(value)
    }
    return this.props.cardTypes.some(type => this.props.creditcards.card.isValid(value, type))
  }

  setValue = (value = '') => {
    if (value) {
      const { parse, format } = this.props.creditcards.card
      // parse -> format -> parse to truncate invalid card patterns
      value = parse(format(parse(value)))
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
      'aria-invalid': value
        ? String(!this.isValid(value))
        : value,
      name: NAME,
      autoComplete: AUTOCOMPLETE,
      type: INPUT_TYPE,
      placeholder: 'Card number',
      ...props,
      value: (this.props.masked && !this.state.focused)
        ? this.getMaskedValue(this.getStateAndHelpers(props))
        : this.props.creditcards.card.format(this.getValue(props.value)),
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
    let type = this.props.creditcards.card.type(value, true)
    if (this.props.cardTypes.length &&
        this.props.cardTypes.indexOf(type) === -1) {
      type = ''
    }
    return {
      type,
      value,
      valid: this.isValid(props.value),
      setValue: this.setValue,
      getInputProps: this.getInputProps
    }
  }

  render () {
    return this.props.render(this.getStateAndHelpers())
  }
}
