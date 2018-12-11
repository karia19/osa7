const blogitRoter = require('express').Router()
const Blog = require('../models/blogit')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenFrom = (request) => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer')){
    return auth.substring(7)
  }
  return null
}

blogitRoter.get('/', async (request, response) => {
       const blogs = await Blog
             .find({})
             .populate('user', {username: 1, name: 1})
             response.json(blogs.map(Blog.format))
})


blogitRoter.post('/', async (request, response) => {
  
    const body = request.body  

    const token = getTokenFrom(request)
    
    const decodedToken = jwt.verify(token, process.env.SECRET)
    response.send(decodedToken)
    
    
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

  try{ 

    const user = await User.findById(decodedToken.id)
    

    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === null ? 0 : body.likes,
        user: user._id
    })
    
    console.log(blog)
    
    const saveBlog  = await blog.save()
  

    
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.status(201).json(saveBlog)

  } catch(expection) {
    if (excpection.name === 'JsonWebTokenError'){
      response.status(401).json({ error: 'something wenr wrong'})
    } else {
      response.status(500).json({ error: 'something went wrong...'})
    }
    
  }
})

blogitRoter.delete('/:id', async (request, response) => {
  try {
    const body = request.body  

    const token = getTokenFrom(request)
    
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (await !token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    const id = body.id

    if (await Blog.findByIdAndRemove(request.params.id)){
      response.status(201).json({"message": "Delete Complete"})
    }else {
      response.status(400).json({ "error": "it's been deleted"})
    }

  } catch (excpection) {
    if (excpection.name === 'JsonWebTokenError'){
      response.status(401).json({ error: "something went wrong"})
    }
    console.log(excpection)
    response.status(400)
  }
})

blogitRoter.put('/:id', async (request, response) => {
  const body = request.body

  const update = {
    likes: body.likes
  }

  try {
    const blog = await Blog.findOneAndUpdate({_id:request.params.id}, update)
    response.status(201).json(blog)

  } catch (expection){
    console.log(expection)
    response.status(400)
  }
})
blogitRoter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const update = {
    comments: body.comments
  }
  const blog = await Blog.findByIdAndUpdate(request.params.id, {$push: {comments: update}})
     response.status(201).json(blog)
  

})
blogitRoter.get('/:id', async (request, response) => {
  console.log(request.params.id)
  const tulos = await Blog.findById(request.params.id)
  console.log(tulos)
  response.status(201).json(tulos)

})

module.exports = blogitRoter;

