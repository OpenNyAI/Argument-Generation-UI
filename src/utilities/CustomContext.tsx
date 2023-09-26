/* eslint-disable @typescript-eslint/naming-convention */
import React, { createContext, useMemo, useState } from 'react'
import { type CustomContextProps } from '../prop-types/labelingProps'

interface contextProp {
  updateAccessToken: (newAccessToken: string) => void
  updateRefreshToken: (newRefreshToken: string) => void
  updateIsAuthenticated: (value: string) => void
  isAuthenticated: string
  accessToken: string
  refreshToken: string
  username: string
  updateUsername: (uname: string) => void
  updateCaseId: (newCaseId: string) => void
  case_id: string
}

export const CustomContext = createContext<contextProp | undefined >(undefined)

export const CustomContextProvider: React.FC<CustomContextProps> = ({ children }) => {
  const usernameStored = localStorage?.getItem('username')
  const accesstokenStored = localStorage?.getItem('accessToken')
  const refreshtokenStored = localStorage?.getItem('refreshToken')
  const caseIdStored = localStorage?.getItem('caseId')
  const [username, setUsername] = useState<string>(usernameStored ?? '')
  const [accessToken, setAccessToken] = useState<string>(accesstokenStored ?? '')
  const [refreshToken, setRefreshToken] = useState<string>(refreshtokenStored ?? '')
  const [case_id, setCaseId] = useState<string>(caseIdStored ?? '')
  const [isAuthenticated, setIsAuthenticated] = useState<string>(localStorage.getItem('logged-in') as string)

  const updateUsername = (uname: string) => {
    setUsername(uname)
    localStorage.setItem('username', uname)
  }

  const updateIsAuthenticated = (value: string) => {
    setIsAuthenticated(value)
    localStorage.setItem('logged-in', String(value))
    console.log('iside context ', localStorage.getItem('logged-in'))
  }

  const updateAccessToken = (newAccessToken: string) => {
    setAccessToken(newAccessToken)
    localStorage.setItem('accessToken', newAccessToken)
  }

  const updateRefreshToken = (newRefreshToken: string) => {
    setRefreshToken(newRefreshToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  const updateCaseId = (newCaseId: string) => {
    setCaseId(newCaseId)
    localStorage.setItem('caseId', newCaseId)
  }

  const contextValue = useMemo(() => (
    {
      updateAccessToken,
      updateRefreshToken,
      accessToken,
      refreshToken,
      isAuthenticated,
      updateIsAuthenticated,
      updateUsername,
      updateCaseId,
      case_id,
      username
    }), [refreshToken, updateRefreshToken, accessToken, updateAccessToken, isAuthenticated, updateIsAuthenticated, updateUsername, username, updateCaseId, case_id])

  return (
    <CustomContext.Provider value={contextValue}>
        {children}
    </CustomContext.Provider>
  )
}
