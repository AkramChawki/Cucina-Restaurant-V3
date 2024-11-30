import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Form({ restaurant, presences, currentMonth }) {
  const today = new Date();
  const defaultMonth = {
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };

  const [selectedRestau, setSelectedRestau] = useState(restaurant?.slug || '');
  const [monthDate, setMonthDate] = useState(
    new Date(
      (currentMonth?.year || defaultMonth.year),
      (currentMonth?.month || defaultMonth.month) - 1
    )
  );

  const daysInMonth = Array.from(
    { length: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  const handleStatusChange = (employeId, day, status) => {
    router.post(route('employes.updateAttendance'), {
      employe_id: employeId,
      day: day,
      status: status,
      month: monthDate.getMonth() + 1,
      year: monthDate.getFullYear()
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedRestau}
          onChange={(e) => setSelectedRestau(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value={restaurant?.slug || ''}>{restaurant?.name || 'Select Restaurant'}</option>
        </select>

        <input
          type="month"
          value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
          onChange={(e) => setMonthDate(new Date(e.target.value))}
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
            {presences.map(({ employe, presence }) => (
              <tr key={employe.id}>
                <td className="border px-4 py-2">{employe.id}</td>
                <td className="border px-4 py-2">{`${employe.first_name} ${employe.last_name}`}</td>
                {daysInMonth.map(day => (
                  <td key={day} className="border px-2 py-1">
                    <select
                      value={presence.attendance_data[day] || ''}
                      onChange={(e) => handleStatusChange(employe.id, day, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">-</option>
                      <option value="present">P</option>
                      <option value="absent">A</option>
                      <option value="conge-paye">CP</option>
                      <option value="conge-non-paye">CNP</option>
                      <option value="repos">R</option>
                      <option value="continue">CC</option>
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