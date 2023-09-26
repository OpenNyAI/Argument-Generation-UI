import React, { useContext } from 'react'
import './header.css'
import { Button } from '@mui/material'
import { CustomContext } from '../utilities/CustomContext'

interface headerProp {
  isLoginPage: boolean
}

const Header: React.FC<headerProp> = ({ isLoginPage }) => {
  const contextValue = useContext(CustomContext)

  const handleLogOut = () => {
    console.log('Logging out')
    contextValue?.updateIsAuthenticated(false)
    contextValue?.updateAccessToken('')
    contextValue?.updateRefreshToken('')
    contextValue?.updateUsername('')
    contextValue?.updateCaseId('')
  }

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <div className='logo'>
                <img src='./OpenNyAiLogo.jpg' style={{ width: '100%' }}/>
            </div>
        </div>
        {isLoginPage &&
        <Button style={{ position: 'fixed', right: '5%', top: '3%', backgroundColor: '#FEF9FF', color: 'black' }} onClick={handleLogOut}>
          Log out
        </Button>}
    </div>
  )
}

export default Header
