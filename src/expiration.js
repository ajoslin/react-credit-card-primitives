const React = require('react')
const PropTypes = require('prop-types')
const creditcards = require('creditcards')
const { callAll, INPUT_TYPE } = require('./util')

const MM_YY = /^\D*(\d{1,2})(\D+)?(\d{1,4})?/
const NAME = 'cc-exp'
const AUTOCOMPLETE = 'exp-date'
const SEPARATOR = ' / '

const pad = n => n < 10 ? ('0' + n) : String(n)

class ExpirationPrimitive extends React.Component {
  static propTypes = {
    month: PropTypes.number,
    year: PropTypes.number,
    defaultMonth: PropTypes.number,
    defaultYear: PropTypes.number,
    onChange: PropTypes.func,
    render: PropTypes.func.isRequired,
    creditcards: PropTypes.object.isRequired
  }

  static defaultProps = {
    onChange: () => {},
    creditcards
  }

  static ERROR_MONTH_YEAR = 'err_monthyear'
  static ERROR_MONTH = 'err_month'
  static ERROR_YEAR = 'err_year'
  static ERROR_PAST_DATE = 'err_pastdate'

  constructor (props) {
    super(props)
    this.state = {
      month: this.props.defaultMonth,
      year: this.props.defaultYear
    }
    if (this.state.month || this.state.year) {
      this.state.rawValue = this.formatExpiration(this.state)
    }
  }

  isControlled () {
    return this.props.month !== undefined && this.props.year !== undefined
  }

  getExpiration (expiration = {}) {
    const key = this.isControlled() ? 'props' : 'state'
    return {
      month: expiration.month !== undefined ? expiration.month : this[key].month,
      year: expiration.year !== undefined ? expiration.year : this[key].year
    }
  }

  isValid (expiration) {
    return !this.getError(expiration)
  }

  getError (expiration) {
    const { expiration } = this.props.creditcards
    const {month, year} = this.getExpiration(expiration)
    const monthValid = expiration.month.isValid(month)
    const yearValid = expiration.year.isValid(year)

    if (!monthValid && !yearValid) return ExpirationPrimitive.ERROR_MONTH_YEAR
    if (!monthValid) return ExpirationPrimitive.ERROR_MONTH
    if (!yearValid) return ExpirationPrimitive.ERROR_YEAR
    if (expiration.isPast(month, year)) return ExpirationPrimitive.ERROR_PAST_DATE
  }

  handleChange = ev => {
    this.setRawValue(ev.target.value)
  }

  setRawValue = rawValue => {
    if (this.isControlled()) {
      this.setState({ rawValue }, () => {
        this.props.onChange(
          this.getStateAndHelpers(this.parseInput(this.state.rawValue))
        )
      })
    } else {
      this.setState({
        rawValue,
        ...this.parseInput(rawValue)
      }, () => {
        this.props.onChange(this.getStateAndHelpers())
      })
    }
  }

  getInputProps = (props = {}) => {
    const value = this.getExpiration(props)
    return {
      ...props,
      'aria-invalid': (value.month || value.year)
        ? String(!this.isValid(props.value))
        : undefined,
      name: NAME,
      autoComplete: AUTOCOMPLETE,
      type: INPUT_TYPE,
      placeholder: `MM${SEPARATOR}YY`,
      maxLength: 2 + SEPARATOR.length + 4,
      onChange: callAll(props.onChange, this.handleChange),
      value: this.formatExpiration(this.getExpiration(props)) || this.formatRawValue(this.state.rawValue)
    }
  }

  getLabelProps = (props = {}) => ({
    ...props,
    htmlFor: NAME
  })

  getStateAndHelpers (props = {}) {
    return {
      ...this.getExpiration(props),
      rawValue: this.state.rawValue,
      error: this.getError(props),
      valid: this.isValid(props),
      setRawValue: this.setRawValue,
      getInputProps: this.getInputProps
    }
  }

  render () {
    return this.props.render(this.getStateAndHelpers())
  }

 parseInput (raw) {
  const parts = raw.match(MM_YY)

  if (!parts) return { month: undefined, year: undefined }

  const rawMonth = parts[1]
  const rawYear = parts[3]

  return {
    month: this.props.creditcards.expiration.month.parse(rawMonth),
    year: (!rawYear || rawYear.length % 2)
      ? undefined
      : this.props.creditcards.expiration.year.parse(rawYear, rawYear.length < 4)
  }
}

 formatExpiration (expiration = {}) {
  if (!expiration.month || !expiration.year) return
  return [
    pad(expiration.month),
    expiration.year >= 2000 && expiration.year <= 2100
      ? String(expiration.year).substring(2)
      : expiration.year
  ]
    .join(SEPARATOR)
 }

  formatRawValue (raw) {
     if (!raw) return ''
     const parts = raw.match(MM_YY)
     if (!parts) return ''

     let month = parts[1] || ''
     let separator = parts[2] || ''
     let year = parts[3] || ''

     if (year.length > 0) {
       separator = SEPARATOR
     } else if (separator === ' /') {
       month = month.substring(0, 1)
       separator = ''
     } else if (month.length === 2 || separator) {
       separator = SEPARATOR
     } else if (month.length === 1 && month !== '0' && month !== '1') {
       month = '0' + month
       separator = ' / '
     }

     return [month, separator, year].join('')
   }
}

}

module.exports = exports.default = ExpirationPrimitive
