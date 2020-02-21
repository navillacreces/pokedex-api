require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
const helmet = require('helmet')

const POKEDEX = require('./pokedex.json')

const PORT = process.env.PORT || 3000

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})



app.use(function validateBearerToken(req, res, next) {
    
    
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken){
      return res.status(401).json({error:"unauthorized request"})
    }
    next()
  })

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.get('/types', function handleTypesReq(req,res) {

    res.json(validTypes)
}) 


app.get('/pokemon', function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    
    let theTypeCapitilized = req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1)
    
    response = response.filter(pokemon =>
      pokemon.type.includes(theTypeCapitilized)
    )
  }

  res.json(response)
})


app.listen(PORT)
