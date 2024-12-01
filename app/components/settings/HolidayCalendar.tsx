import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Holiday } from '~/services/tenantSettingsApi';

interface HolidayCalendarProps {
  holidays: Holiday[];
  onChange: (holidays: Holiday[]) => void;
}

export function HolidayCalendar({ holidays, onChange }: HolidayCalendarProps) {
  const [newHoliday, setNewHoliday] = useState<Holiday>({ name: '', date: '' });

  const handleAdd = () => {
    if (newHoliday.name && newHoliday.date) {
      onChange([...holidays, newHoliday]);
      setNewHoliday({ name: '', date: '' });
    }
  };

  const handleDelete = (index: number) => {
    onChange(holidays.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Holiday Calendar</h3>

      <div className="space-y-3">
        {holidays.map((holiday, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
            <div className="flex-1">
              <span className="font-medium text-gray-700">{holiday.name}</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(holiday.date).toLocaleDateString()}
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {holidays.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No holidays added yet
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Holiday name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              onClick={handleAdd}
              disabled={!newHoliday.name || !newHoliday.date}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add Holiday
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
