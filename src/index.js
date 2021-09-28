require('dotenv').config()

const express = require('express')
const cors = require('cors')
const httpProxy = require('express-http-proxy')

const checkAuth = require('./middlewares/check_auth')

const authRoutes = require('./routes/auth')

const cigarrosServiceProxy = httpProxy(process.env.API_CIGARROS_URL)
const pecasServiceProxy = httpProxy(process.env.API_PECAS_URL)

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    return res.status(200)
  }
  next()
})


app.use('/', authRoutes)


app.all('/cigarros', checkAuth, (req, res, next) => {
  cigarrosServiceProxy(req, res, next)
})
app.all('/cigarros/:id', checkAuth, (req, res, next) => {
  cigarrosServiceProxy(req, res, next)
})


app.all('/pecas', checkAuth, (req, res, next) => {
  pecasServiceProxy(req, res, next)
})
app.all('/pecas/:id', checkAuth, (req, res, next) => {
  pecasServiceProxy(req, res, next)
})

app.use((req, res, next) => {
  const error = new Error('Não encontrado!')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.listen(port, () => console.log(`Server running in port ${port}`))
