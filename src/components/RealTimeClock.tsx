import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
      <Clock className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {formatTime(time)}
      </span>
    </div>
  );
};

export default RealTimeClock;