import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRoutes {
  isLoggedIn: boolean
  children: React.ReactNode
}

const Protected: React.FC<ProtectedRoutes> = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }
  return children
}
export default Protected
