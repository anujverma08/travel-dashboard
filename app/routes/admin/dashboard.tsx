import { Header, StatsCard, TripCard } from 'components'
import { Stats } from 'fs';
import { C } from 'node_modules/react-router/dist/development/lib-B33EY9A0.mjs';
import React from 'react'

const dashboard = () => {
  const user = { name : 'saki'};
  const dashboardStats = {
    totalUsers: 12450,
    userJonined: {currentMonth : 218, lastMonth: 176},
    totalTrips: 3500,
    totalCreated: { currentMonth: 150, lastMonth: 120 },
    userRole: { total: 62, currentMonth: 5, lastMonth: 3 },
  }

  const { totalUsers, userJonined, totalTrips, totalCreated, userRole } = dashboardStats;

  return (
    <main className='dashboard wrapper'>
        <Header 
            title = {`Welcome ${user?.name ?? 'Guest'}`}
            description = "This is your dashboard, where you can manage your account and view your activities."
            /> 

        <section className= "flex flex-col gap-6">
            <div className="grid grid-clos-1 md:grid-cols-3 gap-6 w-full">

            <StatsCard 
                headerTitle="Total Users"
                total={totalUsers}
                currentMonth={userJonined.currentMonth}
                lastMonth={userJonined.lastMonth}
            />
            <StatsCard 
                    headerTitle="TotalTrips"
                    total={totalTrips}
                    currentMonth={totalCreated.currentMonth}
                    lastMonth={totalCreated.lastMonth}
            />

            <StatsCard 
                headerTitle="Active Users"
                total={userRole}
                currentMonth={userRole.currentMonth}
                lastMonth={userRole.lastMonth}
            />
            </div>
        </section>
        
        <TripCard />
        
    </main>
  )
}

export default dashboard