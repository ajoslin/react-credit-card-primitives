const React = require('react')
const {mount} = require('enzyme')
const Cvc = require('../cvc')

function setup ({render = () => <div />, ...props} = {}) {
  let renderArg
  const renderSpy = jest.fn(arg => {
    renderArg = arg
    return render(arg)
  })
  const wrapper = mount(<Cvc {...props} render={renderSpy} />)
  return {renderSpy, wrapper, ...renderArg}
}

test('basic value', () => {
  const {wrapper, setValue, getInputProps} = setup()

  setValue('222')
  expect(getInputProps().value).toEqual('222')

  setValue('3333')
  expect(getInputProps().value).toEqual('3333')
})

test('props for visa and amex', () => {
  let data1 = setup({
    cardType: 'Visa'
  })
  expect(data1.getInputProps()).toMatchSnapshot('cvc visa')
  expect(data1.getInputProps().maxLength).toEqual(3)
  let data2 = setup({
    cardType: 'American Express'
  })
  expect(data2.getInputProps()).toMatchSnapshot('cvc amex')
  expect(data2.getInputProps().maxLength).toEqual(4)

  let data3 = setup()
  expect(data3.getInputProps()).toMatchSnapshot('cvc unknown')
})

test('defaultValue', () => {
  const {wrapper, getInputProps} = setup({
    defaultValue: '333',
    cardType: 'American Express'
  })
  expect(wrapper.instance().isValid()).toBe(false)
  expect(getInputProps().value).toBe('333')
})
