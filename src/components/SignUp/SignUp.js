export default function SignUp({
    signUp, 
    credentials, 
    handleChangeAuth
}) {
    return (
        <>
            <h2>SignUp</h2>
            <form onSubmit={(e) => {
                e.preventDefault()
                signUp()
            }}>
                <input type='name' value={credentials.name} name='name' onChange={handleChangeAuth} placeholder={'Name'}></input>
                <input type='email' value={credentials.email} name='email' onChange={handleChangeAuth} placeholder={'Email'}></input>
                <input type='password' value={credentials.password} name='password' onChange={handleChangeAuth} placeholder={'Password'}></input>
                <input type='submit' value="Sign Up as New User"></input>
            </form>
        </>
    )
}
