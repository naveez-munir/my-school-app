import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ClassDistribution {
  name: string;
  value: number;
  color?: string;
  id?: string;
}

interface StudentDistributionChartProps {
  data: ClassDistribution[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

export function StudentDistributionChart({ data, isLoading }: StudentDistributionChartProps) {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || COLORS[index % COLORS.length]
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Student Distribution by Class</h3>
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
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Student Distribution by Class</h3>
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <p className="text-sm sm:text-base text-gray-500">No student data available</p>
        </div>
      </div>
    );
  }

  const totalStudents = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Student Distribution by Class</h3>
      <div className="text-xs sm:text-sm text-gray-500 mb-2">Total Students: {totalStudents}</div>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={80}
              innerRadius={50}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.id || entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props) => [
                `${value} students (${((value / totalStudents) * 100).toFixed(1)}%)`,
                props.payload.name
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              iconSize={10}
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

