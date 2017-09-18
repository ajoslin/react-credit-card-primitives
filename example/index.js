const React = require('react')
const {render} = require('react-dom')
const App = require('./app')

const root = document.createElement('div')
document.body.appendChild(root)
render(
  <App />,
  root
)
