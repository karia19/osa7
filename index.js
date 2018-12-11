const http = require('http');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
//const Blog = require('./models/blogit')
const blogRouter = require('./controllers/blogit')
const config = require('./utils/config')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')


mongoose.connect(config.mongoUrl)
/*
mongoose
  .connect(config.mongoUrl)
  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

*/
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

app.use('/api/blogs', blogRouter )
app.use('/api/users', userRouter )
app.use('/api/login', loginRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`serve ${config.port}`)
})
server.on('close', () => {
  mongoose.connection.close();
})

//const mongoUrl = 'mongodb://localhost/bloglist'
//mongoose.connect(mongoUrl)
/*
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body  

  const blog = new Blog ({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  })
  
  console.log(blog)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/
module.exports = {
     app, server
}