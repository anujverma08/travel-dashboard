import React from 'react'
import { calculateTrendPercentage } from '~/lib/utils'

const StatsCard = ({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount}:StatsCard) =>{
    const { trend, percentage } = calculateTrendPercentage(currentMonthCount, lastMonthCount);
    
    const isDecrement = trend === 'decrement';
  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">
        {headerTitle}
      </h3>

      <div className="content">
        <div className='flex flex-col gap-4'>

        </div>
      </div>
    </article>

  )
}

export default StatsCard