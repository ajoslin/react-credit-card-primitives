const React = require('react')
const {mount} = require('enzyme')
const Number = require('../number')

function setup ({render = () => <div />, ...props} = {}) {
  let renderArg
  const renderSpy = jest.fn(arg => {
    renderArg = arg
    return render(arg)
  })
  const wrapper = mount(<Number {...props} render={renderSpy} />)
  return {renderSpy, wrapper, ...renderArg}
}

test('value formatting', () => {
  const {wrapper, setValue, getInputProps} = setup()

  setValue('424242')
  expect(getInputProps().value).toEqual('4242 42')

  setValue('4242424242424242')
  expect(getInputProps().value).toEqual('4242 4242 4242 4242')
})

test('validation on all card types', () => {
  const {wrapper, valid, setValue, getInputProps} = setup()

  expect(getInputProps()).toMatchSnapshot('basic no input')
  expect(valid).toBe(false)
  setValue('378282246310005')
  expect(getInputProps()).toMatchSnapshot('basic amex valid')
  expect(wrapper.instance().isValid()).toBe(true)
  setValue('37828224631000')
  expect(getInputProps()).toMatchSnapshot('basic amex invalid')
  expect(wrapper.instance().isValid()).toBe(false)
})

test('validation on given card types', () => {
  const {wrapper, valid, setValue} = setup({
    cardTypes: ['Visa']
  })

  expect(valid).toBe(false)
  setValue('378282246310005')
  expect(wrapper.instance().isValid()).toBe(false)
  expect(wrapper.instance().getStateAndHelpers()).toMatchSnapshot()

  // Make it Visa and it will be valid.
  setValue('4242424242424242')
  expect(wrapper.instance().isValid()).toBe(true)
  expect(wrapper.instance().getStateAndHelpers()).toMatchSnapshot()
})

test('masked', () => {
  const {setValue, getInputProps} = setup({
    masked: true
  })

  // Invalid card (missing one digit)
  setValue('424242424242424')
  expect(getInputProps().value).toEqual('4242 4242 4242 424')

  // Valid AMEX
  setValue('378282246310005')
  expect(getInputProps().value).toEqual('•••• •••••• 10005')
})

test('onChange uncontrolled', () => {
  let changeData
  const {setValue, wrapper} = setup({
    onChange: (data) => {
      changeData = data
    }
  })
  expect(changeData).toBe(undefined)
  setValue('42424')
  expect(changeData.value).toBe('42424')
  expect(changeData.valid).toBe(false)
  expect(changeData.type).toBe('Visa')

  expect(wrapper.state('value')).toEqual('42424')
})

test('onChange w/ controlled input', () => {
  let changeData
  const {wrapper, setValue} = setup({
    value: '',
    onChange: (data) => {
      changeData = data
    }
  })
  expect(changeData).toBe(undefined)
  setValue('42424')
  expect(changeData.value).toBe('42424')
  expect(changeData.valid).toBe(false)
  expect(changeData.type).toBe('Visa')

  // No setState because it's a controlled input
  expect(wrapper.state('value')).toEqual('')
})

test('defaultValue', () => {
  const {wrapper, setValue} = setup({
    defaultValue: '4242'
  })
  expect(wrapper.state('value')).toBe('4242')
  setValue('')
  expect(wrapper.state('value')).toBe('')
})
