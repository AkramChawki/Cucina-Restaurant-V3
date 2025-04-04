import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Download, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Form({ restaurant, presences, currentMonth }) {
  // Access Inertia page properties including auth user
  const { url, auth } = usePage().props;
  const isGuest = Boolean(auth.user.guest);
  console.log("Guest status:", auth.user.guest, "isGuest:", isGuest);
  
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

  // Using ref to prevent the initial render from triggering navigation
  const initialRender = React.useRef(true);
  
  // Effect to navigate when restaurant or month changes
  useEffect(() => {
    // Skip the initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    // Only navigate if we have a restaurant selected
    if (selectedRestau) {
      const month = monthDate.getMonth() + 1;
      const year = monthDate.getFullYear();
      
      // Check if the current data already matches what we're requesting
      if (currentMonth?.month !== month || currentMonth?.year !== year) {
        // Explicitly construct URL with query parameters
        const url = `${route('employes.manageAttendance')}?restau=${selectedRestau}&month=${month}&year=${year}`;
        
        // Use window.location for a full page navigation to preserve all parameters
        window.location.href = url;
      }
    }
  }, [selectedRestau, monthDate]);

  const handleStatusChange = (employeId, day, status) => {
    // If user is a guest, don't allow changes
    if (isGuest) {
      console.log("Guest user attempted to change status - operation blocked");
      return;
    }
    
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

  const getStatusColor = (status) => {
    const colors = {
      'present': 'bg-green-100 text-green-800',
      'absent': 'bg-red-100 text-red-800',
      'conge-paye': 'bg-blue-100 text-blue-800',
      'conge-non-paye': 'bg-orange-100 text-orange-800',
      'repos': 'bg-gray-100 text-gray-800',
      'continue': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || '';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'present': 'P',
      'absent': 'A',
      'conge-paye': 'CP',
      'conge-non-paye': 'CNP',
      'repos': 'R',
      'continue': 'CC',
      '': '-'
    };
    return labels[status] || '-';
  };

  // Calculate the presence value based on the attendance status
  const getPresenceValue = (status) => {
    const values = {
      'present': 1,
      'continue': 1.5,
      'conge-paye': 1,
      'absent': 0,
      'conge-non-paye': 0,
      'repos': 0,
      '': 0
    };
    return values[status] || 0;
  };
  
  // Calculate the total presence for an employee
  const calculateTotalPresence = (attendanceData) => {
    return Object.values(attendanceData).reduce((sum, status) => sum + getPresenceValue(status), 0);
  };

  const handleExport = () => {
    // If user is a guest, don't allow export
    if (isGuest) {
      console.log("Guest user attempted to export - operation blocked");
      return;
    }
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      // Header row
      ['Nom', ...daysInMonth, 'Total Présences'],
      // Data rows
      ...presences.map(({ employe, presence }) => [
        `${employe.first_name} ${employe.last_name}`,
        ...daysInMonth.map(day => getStatusLabel(presence.attendance_data[day])),
        calculateTotalPresence(presence.attendance_data).toFixed(1) // Add total presence
      ])
    ]);

    // Set column widths
    const wscols = [
      {wch: 30},  // Width for Nom column
      ...daysInMonth.map(() => ({wch: 5})),  // Width for day columns
      {wch: 15}   // Width for Total Présences column
    ];
    ws['!cols'] = wscols;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Présences');

    // Generate filename with restaurant name and month/year
    const monthName = monthDate.toLocaleDateString('fr-FR', { month: 'long' });
    const filename = `presences_${restaurant?.name || 'restaurant'}_${monthName}_${monthDate.getFullYear()}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);
  };

  // Handle month change with debounce to prevent UI glitches
  const handleMonthChange = (e) => {
    // Allow both guests and regular users to change the month for viewing
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        setMonthDate(newDate);
      }
    } catch (error) {
      console.error("Invalid date input:", error);
    }
  };

  // Handle restaurant change
  const handleRestaurantChange = (e) => {
    // If user is a guest, don't allow restaurant change
    if (isGuest) {
      console.log("Guest user attempted to change restaurant - operation blocked");
      return;
    }
    
    const newRestau = e.target.value;
    setSelectedRestau(newRestau);
    
    // Directly navigate to the new restaurant with current month/year
    if (newRestau) {
      const month = monthDate.getMonth() + 1;
      const year = monthDate.getFullYear();
      window.location.href = `${route('employes.manageAttendance')}?restau=${newRestau}&month=${month}&year=${year}`;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Guest mode banner */}
      {isGuest && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg mb-4 p-3">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-800">Mode consultation uniquement. Vous ne pouvez pas modifier les données.</span>
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Gestion des Présences</h2>
            <p className="mt-1 text-sm text-gray-600">
              {restaurant?.name} - {monthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              value={selectedRestau}
              onChange={handleRestaurantChange}
              className={`block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                isGuest ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isGuest}
            >
              {/* Ensure we have a select option */}
              <option value="">Select Restaurant</option>
              {/* Add the current restaurant if available */}
              {restaurant?.slug && (
                <option value={restaurant.slug}>{restaurant.name}</option>
              )}
            </select>

            <input
              type="month"
              value={`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`}
              onChange={handleMonthChange}
              className={`block w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                isGuest ? "bg-gray-100" : ""
              }`}
            />

            <button
              onClick={handleExport}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isGuest ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isGuest}
              title={isGuest ? "Mode consultation uniquement" : "Exporter les données"}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: 'Présent', value: 'present', short: 'P' },
            { label: 'Absent', value: 'absent', short: 'A' },
            { label: 'Congé Payé', value: 'conge-paye', short: 'CP' },
            { label: 'Congé Non Payé', value: 'conge-non-paye', short: 'CNP' },
            { label: 'Repos', value: 'repos', short: 'R' },
            { label: 'Continue', value: 'continue', short: 'CC' },
          ].map(status => (
            <div key={status.value} className={`flex items-center p-2 rounded ${getStatusColor(status.value)}`}>
              <span className="text-sm font-medium">{status.short} - {status.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="sticky left-16 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                {daysInMonth.map(day => (
                  <th key={day} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">{day}</th>
                ))}
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presences.map(({ employe, presence }) => (
                <tr key={employe.id}>
                  <td className="sticky left-0 z-10 bg-white px-4 py-2 text-sm text-gray-900">{employe.id}</td>
                  <td className="sticky left-16 z-10 bg-white px-4 py-2 text-sm font-medium text-gray-900">{`${employe.first_name} ${employe.last_name}`}</td>
                  {daysInMonth.map(day => (
                    <td key={day} className="px-1 py-1 text-sm">
                      {isGuest ? (
                        // For guests: Show a non-interactive display of the status
                        <div className={`w-full rounded py-1 text-center text-sm ${getStatusColor(presence.attendance_data[day])}`}>
                          {getStatusLabel(presence.attendance_data[day])}
                        </div>
                      ) : (
                        // For non-guests: Show the interactive select dropdown
                        <select
                          value={presence.attendance_data[day] || ''}
                          onChange={(e) => handleStatusChange(employe.id, day, e.target.value)}
                          className={`w-full border-0 rounded py-1 text-sm focus:ring-1 focus:ring-green-500 ${getStatusColor(presence.attendance_data[day])}`}
                        >
                          <option value="">-</option>
                          <option value="present">P</option>
                          <option value="absent">A</option>
                          <option value="conge-paye">CP</option>
                          <option value="conge-non-paye">CNP</option>
                          <option value="repos">R</option>
                          <option value="continue">CC</option>
                        </select>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-sm font-medium text-right bg-gray-50">
                    {calculateTotalPresence(presence.attendance_data).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}