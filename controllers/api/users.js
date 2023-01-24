require('dotenv').config()
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const signUp = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const token = createJWT(user)
    res.locals.data.user = user
    res.locals.data.token = token
    next()
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) throw new Error('user not found, email was invalid') // if we can find a user throw a error
    const password = crypto.createHmac('sha256', process.env.SECRET).update(req.body.password).digest('hex').split('').reverse().join('')
    const match = await bcrypt.compare(req.body.password, user.password) // compare is a method for bcrypt
    if (!match) throw new Error('Password did not match')
    res.locals.data.user = user
    res.locals.data.token = createJWT(user)
    next()
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const getBookmarksByUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: res.locals.data.email }).populate('bookmarks').sort('bookmarks.createdAt').exec() // take all bookmarks that the user has and turn it into an array
    const bookmark = user.bookmarks
    res.locals.data.bookmarks = bookmark
    next()
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const respondWithToken = (req, res) => {
  res.json(res.locals.data.token)
}

const respondWithUser = (req, res) => {
  res.json(res.locals.data.user)
}

const respondWithBookmarks = (req, res) => {
  res.json(res.locals.data.bookmarks)
}

// Helper Function //
// help function so we dont have to write token information over and over
function createJWT (user) {
  // accept a user and return a token
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '48h', allowInsecureKeySizes: true })
}

module.exports = {
  signUp,
  login,
  getBookmarksByUser,
  respondWithToken,
  respondWithBookmarks,
  respondWithUser
}
