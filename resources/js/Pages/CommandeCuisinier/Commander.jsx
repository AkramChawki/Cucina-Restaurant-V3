import React from 'react'
import Table from './Partials/Table'
import Footer from '@/Components/Footer'

export default function Commander({ categories, ficheId, restau, requiresRest }) {
  return (
    <>
      <Table categories={categories} ficheId={ficheId} restau={restau} requiresRest={requiresRest} />
    </>
  )
}
