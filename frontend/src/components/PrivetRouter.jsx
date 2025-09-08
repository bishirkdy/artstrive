import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

const PrivetRouter = () => {
    const { user } = useSelector((state) => state.auth)
   
  return user ? <Outlet /> : <Navigate to='/login' replace={true} />
}

export default PrivetRouter