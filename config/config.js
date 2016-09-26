require('babel-polyfill');

const environment = {
  development: {
    apiUrl: 'http://localhost:5000/api',
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  node_env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8081,
  apiProtocol: process.env.APIPROTOCOL || 'http',
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 3030,
  app: {
    title: 'Hello ',
    description: 'starter kit',
    meta: {
      charSet: 'utf-8'
    }
  }
}, environment);
