const React = require('react')
const {mount} = require('enzyme')
const Expiration = require('../expiration')

function setup ({render = () => <div />, ...props} = {}) {
  let renderArg
  const renderSpy = jest.fn(arg => {
    renderArg = arg
    return render(arg)
  })
  const wrapper = mount(<Expiration {...props} render={renderSpy} />)
  return {renderSpy, wrapper, ...renderArg}
}

test('basic value', () => {
  const {wrapper, setRawValue, getInputProps} = setup()

  setRawValue('10/2022')
  expect(getInputProps().value).toEqual('10 / 22')
  expect(getInputProps()).toMatchSnapshot()
})
