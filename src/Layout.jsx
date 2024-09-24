import React from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <div className="flex w-full">
        <Sidebar />
        <main className="grow">
          <Navbar />
          <hr />
          <div className='overflow-auto h-[41rem]'>
            <Outlet/>
          </div>
          
        </main>
      </div>
    </>
  )
}

export default Layout;