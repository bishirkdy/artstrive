import React from 'react'
import { Loader } from '../../../components/Loader'

const ScannedHome = () => {
  return (
    <div className='flex flex-col space-y-8 items-center justify-center h-screen'>
        <p className='text-white animate-pulse'>This page is processing , go to dashboard</p>
        <Loader/>
    </div>
  )
}

export default ScannedHome