import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

interface AttendanceTrendChartProps {
  data: AttendanceData[];
  isLoading?: boolean;
  userType?: 'Student' | 'Teacher' | 'Staff';
}

export function AttendanceTrendChart({ data, isLoading, userType = 'Student' }: AttendanceTrendChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: format(new Date(item.date), 'MMM dd'),
      percentage: parseFloat(item.percentage.toFixed(1)),
      present: item.present,
      total: item.total
    }));
  }, [data]);

  const chartTitle = `${userType} Attendance Trend (Last 7 Days)`;

  if (isLoading) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">{chartTitle}</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-sm sm:text-base text-gray-600">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">{chartTitle}</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <p className="text-sm sm:text-base text-gray-500">No attendance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">{chartTitle}</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              className="sm:text-xs"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              className="sm:text-xs"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'percentage') return [`${value}%`, 'Attendance'];
                return [value, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Attendance %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

