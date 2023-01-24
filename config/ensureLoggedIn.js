module.exports = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'YOU SHALL NOT PASS, Unauthorized' })
  next()
}

// if not req.user you can not go further with you request
