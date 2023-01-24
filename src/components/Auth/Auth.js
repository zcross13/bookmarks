import { useState } from 'react'
import Login from '../Login/Login'
import SignUp from '../SignUp/SignUp'

export default function Auth({
    login,
    signUp,
    credentials,
    handleChangeAuth
}) {
    const [showSignUp, setShowSignUp] = useState(true) // toggle
    const [user, setUser] = useState(null)

    return (
        <>
            {
                user && user.name
                    ? <h1>Welcome {user.name.toUpperCase()}</h1>
                    : <>
                        <button
                            onClick={() => {
                                setShowSignUp(!showSignUp)
                            }}
                        >
                            {showSignUp ? 'Sign Up With A New Account Below or Click Here to Login in as an Existing User' : 'Welcome Back. Login in as an exisiting user or Click Here To Sign Up With A New Account'}
                        </button>
                        {
                            showSignUp
                                ? <SignUp
                                    credentials={credentials}
                                    handleChangeAuth={handleChangeAuth}
                                    signUp={signUp} />
                                : <Login
                                    login={login}
                                    credentials={credentials}
                                    handleChangeAuth={handleChangeAuth}
                                    />
                        }
                    </>
            }

        </>
    )
}
