import React from 'react'
import { Link, useLocation } from 'react-router'

const TripCard = ({id, name, location, imageUrl, tags, price}:
  TripCardProps) => {
    const path = useLocation();

  return (
    
      <Link to={path.pathname === '/' || path.pathname.startsWith('/travel') ? `/travel/${id}` : `/trips/${id}`} className="trip-card">
        <img src = {imageUrl} alt={name} />
      </Link>
      
  )
}

export default TripCard