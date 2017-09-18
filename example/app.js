const React = require('react')
const Number = require('../src/number')
const Cvc = require('../src/cvc')
const Expiration = require('../src/expiration')

class App extends React.Component {
  state = {
    restrictAmex: false,
    maskedCvc: false
  }

  toggleAmex = () => this.setState({restrictAmex: !this.state.restrictAmex})

  render () {
    return <div>
      <style dangerouslySetInnerHTML={{__html: 'div { word-break: break-all; }'}} />
      <Number
        masked
        cardTypes={this.state.restrictAmex ? ['americanExpress'] : []}
        render={({value, valid, type, getInputProps}) => (
          <div>
            <p>Number</p>
            <input {...getInputProps()} />
            <div>{JSON.stringify({value, valid, type})}</div>
          </div>
        )} />

      <Cvc
        masked={this.state.maskedCvc}
        cardType={this.state.restrictAmex ? 'americanExpress' : undefined}
        render={({getInputProps, value, valid}) => (
          <div>
            <p>Cvc</p>
            <label style={{display: 'block', margin: '8px'}}>
              <input type='checkbox'
                checked={this.state.maskedCvc}
                onChange={() => this.setState({maskedCvc: !this.state.maskedCvc})} />
              Mask Cvc
            </label>
            <input {...getInputProps()} />
            <div>{JSON.stringify({value, valid})}</div>
          </div>
        )} />

      <Expiration
        render={({getInputProps, value, valid, error, month, year}) => (
          <div>
            <p>Expiration</p>
            <input {...getInputProps()} />
            <div>{JSON.stringify({value, valid, error, month, year})}</div>
          </div>
        )} />
    </div>
  }
}

module.exports = App
