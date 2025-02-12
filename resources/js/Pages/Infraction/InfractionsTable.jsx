import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DateTimeFormatter from '@/utils/DateTimeFormatter';

const InfractionsTable = ({ infractions, employes }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Filter infractions based on selected employee and dates
  const filteredInfractions = infractions.filter(infraction => {
    let matches = true;
    
    if (selectedEmployee) {
      matches = matches && infraction.employe_id.toString() === selectedEmployee;
    }
    
    if (dateFrom) {
      matches = matches && infraction.infraction_date >= dateFrom;
    }
    
    if (dateTo) {
      matches = matches && infraction.infraction_date <= dateTo;
    }
    
    return matches;
  });

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    if (selectedEmployee) params.append('employe_id', selectedEmployee);
    
    const url = `${route('infractions.report')}?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col space-y-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Liste des infractions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Employee Filter */}
          <div className="relative">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">Tous les employés</option>
              {employes.map((employe) => (
                <option key={employe.id} value={employe.id}>
                  {employe.first_name} {employe.last_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          {/* Date Range Inputs */}
          <form onSubmit={handleReportSubmit} className="sm:col-span-3 flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Générer Rapport
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infraction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInfractions.map((infraction) => (
                <tr key={infraction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{infraction.restaurant}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{infraction.poste}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {infraction.employe?.profile_photo && (
                        <img
                          src={`/storage/${infraction.employe.profile_photo}`}
                          alt=""
                          className="h-8 w-8 rounded-full mr-2 object-cover"
                        />
                      )}
                      <span>
                        {infraction.employe?.first_name} {infraction.employe?.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{infraction.infraction_constatee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DateTimeFormatter 
                      dateStr={infraction.infraction_date} 
                      timeStr={infraction.infraction_time}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfractionsTable;