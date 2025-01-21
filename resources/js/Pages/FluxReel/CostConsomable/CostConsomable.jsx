import React from 'react'
import CostConsomableForm from './partials/CostConsomableForm'

export default function CostConsomable({ restaurant, products, currentMonth }) {
  return (
    <CostConsomableForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
