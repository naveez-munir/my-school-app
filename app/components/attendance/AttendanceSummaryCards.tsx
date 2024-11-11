import type { AttendanceSummary } from '~/types/attendance';

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export function AttendanceSummaryCards({ summary }: AttendanceSummaryCardsProps) {
  const cards = [
    {
      title: 'Total',
      value: summary.total || 0,
      percentage: 100,
    },
    {
      title: 'Present',
      value: summary.present || 0,
      percentage: summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(0) : 0,
    },
    {
      title: 'Absent',
      value: summary.absent || 0,
      percentage: summary.total > 0 ? ((summary.absent / summary.total) * 100).toFixed(0) : 0,
    },
    {
      title: 'Late',
      value: summary.late || 0,
      percentage: summary.total > 0 ? ((summary.late / summary.total) * 100).toFixed(0) : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-gray-200 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-sm font-medium text-gray-600 mb-2">{card.title}</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{card.value}</div>
          {card.title !== 'Total' && (
            <div className="text-sm text-gray-500">{card.percentage}%</div>
          )}
        </div>
      ))}
    </div>
  );
}

