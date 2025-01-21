import React from 'react'
import BMLForm from './partials/BMLFom'

export default function BML({ restaurant, currentMonth }) {
  return (
    <BMLForm restaurant={restaurant} currentMonth={currentMonth} />
      
  )
}
