import React from 'react';

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  
  const date = new Date(`${dateStr}T${timeStr}`);
  
  const gmtPlus1Date = new Date(date.getTime() + (60 * 60 * 1000));
  
  const formattedDate = gmtPlus1Date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const formattedTime = gmtPlus1Date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return `${formattedDate} ${formattedTime}`;
};

const DateTimeFormatter = ({ dateStr, timeStr }) => {
  return (
    <span className="whitespace-nowrap">
      {formatDateTime(dateStr, timeStr)}
    </span>
  );
};

export default DateTimeFormatter;