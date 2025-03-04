import React from 'react'
import CostRamadanForm from './partials/CostRamadanForm'

export default function CostRamadan({ restaurant, products, currentMonth }) {
  return (
    <CostRamadanForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
