/* eslint-disable @typescript-eslint/naming-convention */
import React, { createContext, useMemo, useState } from 'react'
import { type CustomContextProps } from '../prop-types/labelingProps'

interface contextProp {
  updateAccessToken: (newAccessToken: string) => void
  updateRefreshToken: (newRefreshToken: string) => void
  updateIsAuthenticated: (value: boolean) => void
  isAuthenticated: boolean
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(((localStorage?.getItem('logged-in')) != null))

  const updateUsername = (uname: string) => {
    setUsername(uname)
    localStorage.setItem('username', uname)
  }

  const updateIsAuthenticated = (value: boolean) => {
    setIsAuthenticated(value)
    localStorage.setItem('logged-in', String(value))
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
