import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { SlotEditor } from './SlotEditor';
import { GenerationMetadataCard } from './GenerationMetadataCard';
import { usePeriods } from '~/hooks/usePeriodQueries';
import { useAllocationsByClass } from '~/hooks/useAllocationQueries';
import { useAddSlot, useUpdateSlot, useRemoveSlot } from '~/hooks/useTimetableQueries';
import { useLeavePolicy } from '~/hooks/useTenantSettings';
import toast from 'react-hot-toast';
import type { Timetable, TimetableSlot } from '~/types/timetable';

interface TimetableGridProps {
  timetable: Timetable;
  readOnly?: boolean;
}

// Using 0-6 format (Sunday=0, Saturday=6) to match backend and JavaScript Date standard
const ALL_DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function TimetableGrid({ timetable, readOnly = false }: TimetableGridProps) {
  const [slotEditorModal, setSlotEditorModal] = useState<{
    isOpen: boolean;
    dayOfWeek?: number;
    periodNumber?: number;
    periodId?: string;
    existingSlot?: TimetableSlot;
    slotIndex?: number;
  }>({ isOpen: false });

  const { data: periods = [] } = usePeriods(true);
  const { data: allocations = [] } = useAllocationsByClass(
    timetable.classId,
    timetable.academicYear
  );
  const { data: leavePolicy } = useLeavePolicy();

  const addSlotMutation = useAddSlot();
  const updateSlotMutation = useUpdateSlot();
  const removeSlotMutation = useRemoveSlot();

  const weeklyOffDays = leavePolicy?.weeklyOffDays || [0, 6];
  const DAYS = useMemo(() => {
    return ALL_DAYS.filter(day => !weeklyOffDays.includes(day.value));
  }, [weeklyOffDays]);

  const teachingPeriods = useMemo(() => {
    return periods.filter(p => p.periodType === 'TEACHING');
  }, [periods]);

  const getSlot = (dayOfWeek: number, periodNumber: number): TimetableSlot | undefined => {
    return timetable.schedule?.find(
      slot => slot.dayOfWeek === dayOfWeek && slot.periodNumber === periodNumber
    );
  };

  const getSlotIndex = (dayOfWeek: number, periodNumber: number): number => {
    return timetable.schedule?.findIndex(
      slot => slot.dayOfWeek === dayOfWeek && slot.periodNumber === periodNumber
    ) ?? -1;
  };

  const handleCellClick = (dayOfWeek: number, period: any) => {
    if (readOnly) return;

    const existingSlot = getSlot(dayOfWeek, period.periodNumber);
    const slotIndex = getSlotIndex(dayOfWeek, period.periodNumber);

    setSlotEditorModal({
      isOpen: true,
      dayOfWeek,
      periodNumber: period.periodNumber,
      periodId: period.id,
      existingSlot,
      slotIndex: slotIndex >= 0 ? slotIndex : undefined,
    });
  };

  const handleSlotSave = (slot: TimetableSlot) => {
    if (slotEditorModal.slotIndex !== undefined) {
      updateSlotMutation.mutate(
        {
          id: timetable.id,
          slotIndex: slotEditorModal.slotIndex,
          slot,
        },
        {
          onSuccess: () => {
            toast.success('Slot updated successfully');
            setSlotEditorModal({ isOpen: false });
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update slot');
          },
        }
      );
    } else {
      addSlotMutation.mutate(
        { id: timetable.id, slot },
        {
          onSuccess: () => {
            toast.success('Slot added successfully');
            setSlotEditorModal({ isOpen: false });
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add slot');
          },
        }
      );
    }
  };

  const handleSlotDelete = (dayOfWeek: number, periodNumber: number) => {
    const slotIndex = getSlotIndex(dayOfWeek, periodNumber);
    if (slotIndex < 0) return;

    removeSlotMutation.mutate(
      { id: timetable.id, slotIndex },
      {
        onSuccess: () => {
          toast.success('Slot removed successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to remove slot');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {timetable.generationType === 'AUTO_GENERATED' && timetable.autoGenerationMetadata && (
        <GenerationMetadataCard metadata={timetable.autoGenerationMetadata} />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                Day / Period
              </th>
              {teachingPeriods.map((period) => (
                <th
                  key={period.id}
                  className="border border-gray-300 px-2 py-3 text-center text-sm font-semibold text-gray-700 min-w-[150px]"
                >
                  <div>{period.periodName}</div>
                  <div className="text-xs font-normal text-gray-500">
                    {period.startTime} - {period.endTime}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day.value} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-700 bg-gray-50">
                  {day.label}
                </td>
                {teachingPeriods.map((period) => {
                  const slot = getSlot(day.value, period.periodNumber);
                  return (
                    <td
                      key={`${day.value}-${period.id}`}
                      className={`border border-gray-300 px-2 py-2 text-center ${
                        !readOnly ? 'cursor-pointer hover:bg-blue-50' : ''
                      } ${slot ? 'bg-blue-100' : 'bg-white'}`}
                      onClick={() => handleCellClick(day.value, period)}
                    >
                      {slot ? (
                        <div className="space-y-1">
                          <div className="font-semibold text-sm text-gray-900">
                            {slot.subjectName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {slot.teacherName}
                          </div>
                          {slot.room && (
                            <div className="text-xs text-gray-500">
                              Room: {slot.room}
                            </div>
                          )}
                          {!readOnly && (
                            <div className="flex justify-center gap-1 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCellClick(day.value, period);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-200 rounded"
                                title="Edit"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotDelete(day.value, period.periodNumber);
                                }}
                                className="p-1 text-red-600 hover:bg-red-200 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        !readOnly && (
                          <div className="text-gray-400 text-sm flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                          </div>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">How to use:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Click on any empty cell to add a subject</li>
                <li>Click on a filled cell to edit or delete</li>
                <li>Only subjects allocated to this class will be available</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {slotEditorModal.isOpen && (
        <SlotEditor
          isOpen={slotEditorModal.isOpen}
          onClose={() => setSlotEditorModal({ isOpen: false })}
          onSave={handleSlotSave}
          dayOfWeek={slotEditorModal.dayOfWeek!}
          periodNumber={slotEditorModal.periodNumber!}
          periodId={slotEditorModal.periodId!}
          existingSlot={slotEditorModal.existingSlot}
          allocations={allocations}
          periods={periods}
        />
      )}
    </div>
  );
}

