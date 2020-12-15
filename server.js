require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-project.json')

console.log('started up')

const app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    console.log('apiToken - process.env', apiToken)
    const authToken = req.get('Authorization')
    console.log('authToken - req.get"authorization', authToken)
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  }

const validGenre = ['Action', 'Drama', 'Animation', 'Romantic', 'Comedy', 'Spy', 'Crime', 'Thriller', 'Adventure', 'Documentary', 'Horror']

function handleGetGenre(req, res) {
    res.json(validGenre)
}

app.get('/genre', handleGetGenre)

app.get('/', (req, res) => {
    console.log('home sweet home')
})

app.get('/dump', (req, res) => {
    console.log('dump')
    res.send(MOVIES)
})

app.get('/movie', function handleGetMovie(req, res) {
    const { genre = '', country = '', avg_vote } = req.query

    let results = MOVIES

    if (genre) {
        results = results.filter( movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }

    if (country) {
        results = results.filter( movie => 
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    if (avg_vote) {
        results = results.filter( movie => 
            Number(movie.avg_vote) >= Number(avg_vote)
        )
    }

    res.send(results)
})

const Port = 8000
app.listen(Port, () => {
    console.log('running the 8K yall')
})
