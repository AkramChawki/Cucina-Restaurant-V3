import React from 'react'
import CostCuisineForm from './partials/CostCuisineForm'

export default function CostCuisine({ restaurant, products, currentMonth }) {
  return (
    <CostCuisineForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
