import Navbar from '@/components/Navbar'
import Welcome from '@/components/Voice/Welcome'
import Main from '@/components/Dashboard/Main'
import Activity from '@/components/Dashboard/Activity'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <Navbar />

      <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
        <Welcome />
        <Main />
        <Activity />
      </div>
    </div>
  )
}

export default Dashboard