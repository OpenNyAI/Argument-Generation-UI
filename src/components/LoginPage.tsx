import React, { useContext, useEffect, useState } from 'react'
import Header from './header'
import './LoginPage.css'
import './SignUpPage.css'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { postLogin } from '../utilities/Api'
import { CustomContext } from '../utilities/CustomContext'

const Login: React.FC = () => {
  const contextValue = useContext(CustomContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [buttonActive, setButtonActive] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  useEffect(() => {
    if (formData.email !== '' && formData.password !== '') {
      setButtonActive(false)
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Perform form validation here (e.g., check for empty fields)
    if ((formData.email.length === 0) || (formData.password.length === 0)) {
      alert('Please fill in both fields.')
      return
    } else {
      postLogin(formData.email, formData.password).catch((error) => { console.log(error) })
        .then((result) => {
          if (result.detail !== undefined) {
            console.log('password or username wrong')
            setErrorMessage(result.detail)
          } else {
            console.log('logged in')
            contextValue?.updateIsAuthenticated('true')
            contextValue?.updateAccessToken(result.access_token)
            contextValue?.updateRefreshToken(result.refresh_token)
            contextValue?.updateUsername(formData.email)
            setErrorMessage('')
            const details = {
              token: result
            }
            navigate('/homepage', { state: { details } })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          setErrorMessage('An error occurred during login')
        })
    }

    // For demonstration purposes, log the form data to the console
    console.log(formData)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Header isLoginPage={false}/>
      <div className='login-layout'>
      { (errorMessage !== '') &&
          <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form className='login-form' onSubmit={handleSubmit}>
          <div>
            <TextField
              id="filled-basic"
              label="EMAIL"
              variant="filled"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='login-input'
            />
          </div>
          <div>
            <TextField
             id="filled-basic"
              label="PASSWORD"
              variant="filled"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className='login-input'
            />
          </div>
          <Button type="submit" disabled={buttonActive} className='login-button' sx={{ backgroundColor: '#DD81F6', color: 'white', marginTop: '20px' }}>Login</Button>
        </form>
          <Button type="submit" onClick={handleSignUp} className='signup-button' sx={{ backgroundColor: '#DD81F6', color: 'white', marginTop: '10px' }}>Sign-up</Button>
      </div>
    </div>
  )
}

export default Login
