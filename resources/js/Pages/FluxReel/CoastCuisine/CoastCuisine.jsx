import React from 'react'
import CoastCuisineForm from './partials/CoastCuisineForm'

export default function CoastCuisine({ restaurant, products, currentMonth }) {
  return (
    <CoastCuisineForm restaurant={restaurant} products={products} currentMonth={currentMonth} />
      
  )
}
