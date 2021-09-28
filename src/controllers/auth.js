const { pool } = require('../config/db')
const jwt = require('jsonwebtoken')


exports.login = (req, res) => {
  const { usuario, senha } = req.body

  let user = {}

  pool.query('SELECT * FROM usuarios where usuario = $1',
    [usuario], (error, results) => {
      if (error || results.rowCount == 0) {
        return res.status(401).json({ status: 'error', 
        message: 'usuario não encontrado!' })
      } else {
        user = results.rows[0]

        if (user.senha !== senha) {
          res.status(400).json({
            status: 'erro',
            message: 'Senha inválida!'
          })
        } else {
          const token = jwt.sign(
            user,
            process.env.JWT_SECRET,
            {
              expiresIn: '1h'
            })
            return res.status(200).json({
              message: 'Autenticado!',
              token: token
            })
        }
      }
    }
  )
}