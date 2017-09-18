const React = require('react')
const PropTypes = require('prop-types')
const Cvc = require('creditcards/cvc')
const Types = require('creditcards-types')
const { callAll, INPUT_TYPE } = require('./util')

const AUTOCOMPLETE = 'cc-csc'
const NAME = 'cvc'

module.exports = exports.default = class CvcPrimitive extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    masked: PropTypes.bool,
    cardType: PropTypes.oneOf(Object.keys(Types.types)),
    onChange: PropTypes.func,
    render: PropTypes.func.isRequired
  }

  static defaultProps = {
    masked: false,
    onChange: () => {}
  }

  state = {
    value: '',
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
    return Cvc.isValid(value, this.props.cardType)
  }

  getPattern () {
    return this.props.cardType === undefined
      ? '[0-9]{3,4}'
      : `[0-9]{${Types.types[this.props.cardType].cvcLength}}`
  }

  setValue = (value) => {
    if (!this.isControlled()) {
      this.setState({ value }, () => {
        this.props.onChange(this.getStateAndHelpers())
      })
    } else {
      this.props.onChange(this.getStateAndHelpers({ value }))
    }
  }

  handleFocus = () => this.setState({ focused: true })
  handleBlur = () => this.setState({ focused: false })
  handleChange = ev => this.setValue(ev.target.value)

  getInputProps = (props = {}) => ({
    ...props,
    name: NAME,
    autoComplete: AUTOCOMPLETE,
    type: (!this.state.focused && this.props.masked) ? 'password' : INPUT_TYPE,
    placeholder: 'CVC',
    pattern: this.getPattern(),
    value: this.getValue(),
    onFocus: callAll(props.onFocus, this.handleFocus),
    onBlur: callAll(props.onBlur, this.handleBlur),
    onChange: callAll(props.onChange, this.handleChange)
  })

  getStateAndHelpers (props = {}) {
    return {
      focused: this.state.focused,
      value: this.getValue(props.value),
      valid: this.isValid(props.value),
      setValue: this.setValue,
      getInputProps: this.getInputProps
    }
  }

  render () {
    return this.props.render(this.getStateAndHelpers())
  }
}
