import { useState, useEffect } from "react"

export default function App(){
    /*
    Login, SignUp, CreateBookmark, ListBookmarksByUser, DeleteBookmark, UpdateBookmark 
    */

    const handleChangeAuth = (event) => {
        setCredentials({...credentials, [event.target.name]: event.target.value}) // name will be equal to the value 
    } 
    const handleChange = (event) => {
        setBookmark({...bookmark, [event.target.name]: event.target.value})
    }

    const [credentials, setCredentials] = useState({
        email: '', 
        password: '', 
        name: ''
    })
    const [token, setToken] = useState('')
    const [bookmark, setBookmark] = useState({
        title: '', 
        url: ''
    })
    const [bookmarks, setBookmarks ] = useState([])
    const login = async () => {
        try{
            const response = await fetch('/api/users/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({email: credentials.email, password: credentials.password}) // turn object into data
            })
            const tokenResponse = await response.json()
            setToken(tokenResponse)
            localStorage.setItem('token', JSON.stringify(tokenResponse))
        }catch(error){
            console.error(error)
        }
    }
    const signUp = async () => {
        try{
            const response = await fetch('/api/users', {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({...credentials}) // turn object into data
            })
            const tokenResponse = await response.json()
            setToken(tokenResponse)
            localStorage.setItem('token', JSON.stringify(tokenResponse))
        }catch(error){
            console.error(error)
        }
    }
    const createBookmark = async () => {
        try{
            const response = await fetch('/api/bookmarks', {
                method:'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                }, 
                body: JSON.stringify({...bookmark})
            })
            const data = await response.json()
            setBookmarks([data, ...bookmarks])
            setBookmark({
                title: '', 
                url: ''
            })
        }catch(error){
            console.error(error)
        }
    }
    const listBookmarksByUser = async () => {
        try{
            const response = await fetch('/api/users/bookmarks')
            const data = await response.json()
            setBookmarks(data)
        }catch(error){
            console.error(error)
        }
    }
    const deleteBookmark = async (id) => {
        try{
            const response = await fetch(`/api/bookmarks/${id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            const bookmarksCopy = [...bookmarks]// need to make a copy before you can manutiplate the array 
            const index = bookmarksCopy.findIndex(bookmark => id === bookmark.id) //find the id to delete from the list
            bookmarksCopy.splice(index, 1)
            setBookmarks(bookmarksCopy)
        }catch(error){
            console.error(error)
        }
    }
    const updateBookmark = async (id, updatedData) => {
        try{
            const response = await fetch(`/api/bookmarks/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData) //differ from delete 
            })
            const data = await response.json()
            const bookmarksCopy = [...bookmarks]// need to make a copy before you can manutiplate the array 
            const index = bookmarksCopy.findIndex(bookmark => id === bookmark.id) //find the index of where the id match
            bookmarksCopy[index] = {...bookmarksCopy[index], ...updatedData} // take the id and find the information and update the data with the new and set the bookmark with the new update 
            setBookmarks(bookmarksCopy)
        }catch(error){
            console.error(error)
        }
    }
// call when the page first loads 
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token && token !== 'null' && token !== 'undefined'){
            listBookmarksByUser()
        }
    }, [])
    
    return( 
        <>
        <h2>Login</h2>
        <form onSubmit={(e) => {
            e.preventDefault()
            login()
        }}>
            <input type='text' value={credentials.email} name='email' onChange={handleChangeAuth} placeholder={'Email Here'}></input>
            <input type='password' value={credentials.password} name='password' onChange={handleChangeAuth}  placeholder={'Password'}></input>
            <input type='submit' value="Login as Existing User "></input>
        </form>
        <h2>SignUp</h2>
        <form onSubmit={(e) => {
            e.preventDefault()
            signUp()
        }}>
            <input type='name' value={credentials.name} name='name' onChange={handleChangeAuth}  placeholder={'Name'}></input>
            <input type='email' value={credentials.email} name='email' onChange={handleChangeAuth}  placeholder={'Email'}></input>
            <input type='password' value={credentials.password} name='password' onChange={handleChangeAuth}  placeholder={'Password'}></input>
            <input type='submit' value="Sign Up as New User"></input>
        </form>
        <h2>Create A Bookmark</h2>
        <form onSubmit={(e) => {
            e.preventDefault()
            createBookmark()
        }}>
            <input type='text' value={bookmark.title} name='title' onChange={handleChange}  placeholder={'Title'}></input>
            <input type='text' value={bookmark.url} name='url' onChange={handleChange}  placeholder={'URL'}></input>
            <input type='submit' value='Create Bookmark'></input>
        </form>
        <ul>
            { bookmarks.length ? bookmarks.map(item => (
                <li key={item._id}>
                    <h4>{item.title}</h4>
                    <a href={item.url} target='_blank'>{item.url}</a>
                </li>
            )): <> No Bookmarks Added</>}
        </ul>
        </>
    )
}