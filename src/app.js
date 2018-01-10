const app = require('express')()

app.get('/', (req, res) => res.status(404).send('Not found'))

module.exports = app
