const app = require('express')()

app.get('/', (req, res) => res.send('Hello world!'))

app.listen(process.env.APP_PORT || 3000, () => console.log('Listening'))
