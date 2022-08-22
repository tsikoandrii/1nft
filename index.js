require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const { body, validationResult } = require('express-validator')
const ApplicationController = require('./controllers/application')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

const PORT = process.env.PORT || 8080

app.post(
  '/append',
  body('name').not().isEmpty(),
  body('email').isEmail(),
  body('discord').not().isEmpty(),
  body('nft').not().isEmpty(),
  body('goal').not().isEmpty(),
  async (req, res) => {
  try {
    const { name, email, discord, nft, goal } = req.body

    // Validation Body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Getting the latest index for numbering
    const lastIndex = await ApplicationController.getCeilValue('H2')

    const response = await ApplicationController.append(lastIndex, name, email, discord, nft, goal)

    res.status(response.status).json({
      message: response.status === 200 ? 'Application has been append!' : 'Somethings went wrong!'
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Somethings went wrong!'
    })
  }
})

app.use('/', express.static(path.join(__dirname, 'html')))

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
