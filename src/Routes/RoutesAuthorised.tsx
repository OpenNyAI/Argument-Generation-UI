/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import { Route, Routes } from 'react-router-dom'
import FactsPage from '../components/FactsPage'
import { CustomContext } from '../utilities/CustomContext'
import Protected from '../Protected'
import Statutes from '../components/StatutesPage'
import Issues from '../components/IssuesPage'
import PrecedentPage from '../components/PrecedentPage'
import ArgumentsPage from '../components/ArgumentsPage'

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

function RoutesAuth () {
  const contextValue = useContext(CustomContext)

  let accessTokenExpireTime = 0
  const calculateTimeBeforeExpiration = () => {
    const currentTime = Math.floor(Date.now() / 1000)
    return accessTokenExpireTime - currentTime - 5 // Refresh 5 seconds before expiration
  }

  // Check if the access token is expired
  const isAccessTokenExpired = () => {
    if (((contextValue?.isAuthenticated) === true) && contextValue.accessToken.length > 0) {
      const basicDecode: string = atob(contextValue.accessToken?.split('.')[1])
      const decodedToken: unknown = JSON.parse(basicDecode)
      const currentTime = Math.floor(Date.now() / 1000)
      accessTokenExpireTime = Number((decodedToken as Record<string, unknown>).exp)
      return Number((decodedToken as Record<string, unknown>).exp) < currentTime
    }
  }

  const refreshAccessToken = async () => {
    const requestBody = {
      email_id: contextValue?.username,
      refresh_token: contextValue?.refreshToken
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_URL as string}/auth/new-auth-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const data: unknown = await response.json()
      return data
    } catch (error) {
      return {}
    }
  }

  const checkAndRefreshToken = async () => {
    console.log('refreshtoken time', accessTokenExpireTime, calculateTimeBeforeExpiration())
    if ((isAccessTokenExpired() === true) && ((contextValue?.isAuthenticated) === true)) {
      try {
        const newTokenInfo = await refreshAccessToken()
        contextValue.updateAccessToken((newTokenInfo as LoginResponse)?.access_token)
        contextValue.updateRefreshToken((newTokenInfo as LoginResponse)?.refresh_token)
        console.log('New Access Token:', (newTokenInfo as LoginResponse)?.access_token)

        // Now you can make API requests using the new access token
      } catch (error) {
      }
    }
  }

  useEffect(() => {
    const refreshTokenCheckInterval = setInterval(checkAndRefreshToken, calculateTimeBeforeExpiration() * 1000)
    return () => {
      clearInterval(refreshTokenCheckInterval)
    } // Check every minute
  }, [])

  return (
    <Routes>
      <Route path='/homepage' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><Layout /></Protected>} />
      <Route path='/facts' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><FactsPage /></Protected>} />
      <Route path='/issues' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><Issues /></Protected>} />
      <Route path='/statutes' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><Statutes /></Protected>} />
      <Route path='/precedent' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><PrecedentPage /></Protected>} />
      <Route path='/arguments' element={<Protected isLoggedIn={contextValue?.isAuthenticated as boolean}><ArgumentsPage /></Protected>} />
    </Routes>
  )
}

export default RoutesAuth
