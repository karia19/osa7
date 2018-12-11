const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.post('/', async (req, res) => {
    try {
        const body = req.body

        
        const finUser = await User.find({ username: body.username })
        const passWordLen = await (body.password.length < 3)
      
        if ( passWordLen ){
           return res.status(400).json({ error: 'Too short password'})
        }else if ( finUser.length != 0 ){
            return res.status(400).json({ error: 'username must be unique'})
        }



        const salRounds = 10
        const passpordHash = await bcrypt.hash(body.password, salRounds)

       

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passpordHash,
            adult: body.adult === null ? true : body.adult,
           
        })

        const savedUser = await user.save()

        res.json(savedUser)


    } catch (expection){
        console.log(expection)
        res.status(500)
    }
})
userRouter.get('/', async (reg, res) => {
    const userrs = await User
        .find({})
        .populate('blogs', {title: 1, author: 1, likes: 1 })
    res.json(userrs.map(User.format))
})
userRouter.get('/:id', async (req, res) => {
    const body = req
    
    
    const use = await User.findById({_id:req.params.id})
    .populate('blogs', {title: 1, author: 1, likes: 1 })
    res.status(201).json(use)
})


module.exports = userRouter