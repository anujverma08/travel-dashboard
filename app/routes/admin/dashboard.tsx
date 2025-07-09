import { Header } from 'components'
import React from 'react'

const dashboard = () => {
  const user = { name : 'saki'};

  return (
    <main className='dashboard wrapper'>
        <Header 
            title = {`Welcome ${user?.name ?? 'Guest'}`}
            description = "This is your dashboard, where you can manage your account and view your activities."
            /> 

             Dash gboar Page contents 
    </main>
  )
}

export default dashboard