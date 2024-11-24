import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Form({ restaurant, employes }) {
  const [selectedRestau, setSelectedRestau] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  console.log(employes);

  const daysInMonth = Array.from(
    { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  const formatDate = (day) => {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedRestau}
          onChange={(e) => setSelectedRestau(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option key={restaurant.id} value={restaurant.slug}>{restaurant.name}</option>
        </select>

        <input
          type="month"
          value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`}
          onChange={(e) => setCurrentMonth(new Date(e.target.value))}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Nom</th>
              {daysInMonth.map(day => (
                <th key={day} className="border px-4 py-2 text-center w-12">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employes.map(employe => (
              <tr key={employe.id}>
                <td className="border px-4 py-2">{employe.id}</td>
                <td className="border px-4 py-2">{`${employe.first_name} ${employe.last_name}`}</td>
                {daysInMonth.map(day => (
                  <td key={day} className="border px-2 py-1">
                    <select
                      value={''}
                      onChange={(e) => handleStatusChange(employe.id, day, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">-</option>
                      <option value="present">P</option>
                      <option value="absent">A</option>
                      <option value="late">R</option>
                      <option value="excused">E</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}