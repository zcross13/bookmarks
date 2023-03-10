import { useState, useEffect } from "react"
import Auth from "./components/Auth/Auth"


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
        }catch(error){
            console.error(error)
        } finally{
            setBookmark({
                title: '', 
                url: ''
            })
        } // to allow for setBookmark has time to finish
    }
    const listBookmarksByUser = async () => {
        try{
            const response = await fetch('/api/users/bookmarks', {
                method: 'GET', 
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
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
        const tokenData = localStorage.getItem('token')
        if(tokenData && tokenData !== 'null' && tokenData !== 'undefined'){
            listBookmarksByUser()
        }
    }, [])
    
    //take the token that in the local storage and put it in the state
    useEffect(() => {
        const tokenData = localStorage.getItem('token')
        if(tokenData && tokenData !== 'null' && tokenData !== 'undefined'){
            setToken(JSON.parse(tokenData))
        }
    }, [])
    return( 
        <>
        <Auth
            login={login}
            credentials={credentials}
            handleChangeAuth={handleChangeAuth}
            signUp={signUp}
            />
        
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