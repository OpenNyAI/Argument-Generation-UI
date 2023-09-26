import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import './SignUpPage.css'
import Header from './header'
import { postSignup } from '../utilities/Api'
import { useNavigate } from 'react-router-dom'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    affliation: '',
    password: ''
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Perform form validation here (e.g., check for empty fields)
    if ((formData.username.length === 0) || (formData.email.length === 0) || (formData.password.length === 0)) {
      alert('Please fill in all fields.')
    } else {
      postSignup(formData.username, formData.email, formData.affliation, formData.password).catch((error) => { console.log(error) })
        .then((result) => {
          console.log(result)
          navigate('/')
        })
        .catch((error) => {
          console.error('Error:', error)
          // setErrorMessage('An error occurred during login')
        })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Header isLoginPage={false}/>
    <div className='signup-layout'>
      <form onSubmit={handleSubmit} className='signup-form'>
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
            <div>
            {/* <label>Username:</label> */}
            <TextField
                id="filled-basic"
                label="NAME"
                variant="filled"
                // type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className='signup-input'
            />
            </div>
            <div>
                {/* <label>Email:</label> */}
                <TextField
                    id="filled-basic"
                    label="EMAIL"
                    variant="filled"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className='signup-input'
                />
            </div>
            <div>
                {/* <label>Affliation:</label> */}
                <TextField
                    id="filled-basic"
                    label="AFFILIATION"
                    variant="filled"
                    type="affliation"
                    name="affliation"
                    value={formData.affliation}
                    onChange={handleChange}
                    className='signup-input'
                />
            </div>
            <div>
            {/* <label>Password:</label> */}
            <TextField
                id="filled-basic"
                label="PASSWORD"
                variant="filled"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className='signup-input'
            />
            </div>
            <Button type="submit" className='signup-button' sx={{ backgroundColor: '#DD81F6', color: 'white' }}>Sign Up</Button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default SignUp
