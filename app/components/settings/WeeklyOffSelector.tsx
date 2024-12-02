interface WeeklyOffSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function WeeklyOffSelector({ selectedDays, onChange }: WeeklyOffSelectorProps) {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Weekly Off Days</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DAYS.map((day) => (
          <label
            key={day.value}
            className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-colors ${
              selectedDays.includes(day.value)
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{day.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
