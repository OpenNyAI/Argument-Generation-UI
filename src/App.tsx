import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import SignUp from './components/SignUpPage'
import Login from './components/LoginPage'
import { CustomContextProvider } from './utilities/CustomContext'
import RoutesAuth from './Routes/RoutesAuthorised'

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark'
//   }
// })

const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})

function App () {
  return (
    <CustomContextProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Navigate to='/login' replace />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/*' element={<RoutesAuth />}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CustomContextProvider>
  )
}

export default App
