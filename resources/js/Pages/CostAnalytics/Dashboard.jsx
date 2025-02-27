import React from 'react'
import CostAnalyticsDashboard from './components/CostAnalyticsDashboard'

export default function Dashboard({
    restaurants,
    selectedRestaurant,
    selectedMonth,
    selectedYear,
    foodCosts,
    consumableCosts,
    monthlySummary,
    chartData
}) {
  return (
    <>
      <CostAnalyticsDashboard 
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        foodCosts={foodCosts}    
        consumableCosts={consumableCosts}
        monthlySummary={monthlySummary}
        chartData={chartData}
      />
    </>
  )
}
