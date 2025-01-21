import React from 'react'
import CostEconomatForm from './partials/CostEconomatForm'

export default function CostEconomat({ restaurant, products, currentMonth }) {
  return (
    <CostEconomatForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
