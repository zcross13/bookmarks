const router = require('express').Router()
const bookmarkCrtl = require('../../controllers/api/bookmarks')
const checkToken = require('../../config/checkToken')
const ensureLoggedIn = require('../../config/ensureLoggedIn')


// api/bookmarks/:id
// DELETE 
// destroy bookmark
router.delete('/:id', checkToken, ensureLoggedIn, bookmarkCrtl.destroyBookmark, bookmarkCrtl.respondWithBookmark)

// api/bookmarks/:id
// PUT
// update bookmark
router.put('/:id', checkToken, ensureLoggedIn, bookmarkCrtl.updateBookmark, bookmarkCrtl.respondWithBookmark)

// api/bookmarks
// POST 
// create bookmark 
router.post('/', checkToken, ensureLoggedIn, bookmarkCrtl.createBookmark, bookmarkCrtl.respondWithBookmark)

module.exports = router 