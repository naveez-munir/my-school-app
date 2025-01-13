import { useNavigate, useParams } from 'react-router';
import { TimetableGrid } from '~/components/timetable/timetables/TimetableGrid';
import { ConflictBanner } from '~/components/timetable/timetables/ConflictBanner';
import { TimetablePrint } from '~/components/timetable/timetables/TimetablePrint';
import { useTimetable, useTimetableConflicts, useUpdateTimetableStatus } from '~/hooks/useTimetableQueries';
import { ArrowLeft, Calendar, CheckCircle, Archive, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin } from '~/utils/auth';

export function meta() {
  return [
    { title: "Timetable Details" },
    { name: "description", content: "View and edit timetable details" },
  ];
}

export default function TimetableDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userIsAdmin = isAdmin();

  const { data: timetable, isLoading } = useTimetable(id!);
  const { data: conflictsData, isError: conflictsError } = useTimetableConflicts(id!);
  const updateStatusMutation = useUpdateTimetableStatus();

  const handlePublish = () => {
    if (!timetable) return;

    if (conflictsData?.conflicts && conflictsData.conflicts.some(c => c.severity === 'ERROR')) {
      toast.error('Cannot publish timetable with errors. Please resolve all conflicts first.');
      return;
    }

    updateStatusMutation.mutate(
      { id: timetable.id, status: 'ACTIVE' },
      {
        onSuccess: () => {
          toast.success('Timetable published successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to publish timetable');
        }
      }
    );
  };

  const handleArchive = () => {
    if (!timetable) return;

    updateStatusMutation.mutate(
      { id: timetable.id, status: 'ARCHIVED' },
      {
        onSuccess: () => {
          toast.success('Timetable archived successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to archive timetable');
        }
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center text-gray-500">Loading timetable...</div>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center text-gray-500">Timetable not found</div>
      </div>
    );
  }

  const isDraft = timetable.status === 'DRAFT';
  const isActive = timetable.status === 'ACTIVE';
  const hasErrors = conflictsData?.conflicts?.some(c => c.severity === 'ERROR');

  return (
    <>
      <TimetablePrint timetable={timetable} />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 screen-only">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button
              onClick={() => navigate('/dashboard/timetable/timetables')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Timetables
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-700">
                {timetable.displayName}
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
              <span>{timetable.className}</span>
              <span>•</span>
              <span>{timetable.academicYear}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                timetable.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                timetable.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {timetable.status}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Timetable
            </button>
            {userIsAdmin && (
              <>
                {isDraft && (
                  <button
                    onClick={handlePublish}
                    disabled={hasErrors || updateStatusMutation.isPending}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={hasErrors ? 'Resolve all errors before publishing' : 'Publish timetable'}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Publish
                  </button>
                )}
                {isActive && (
                  <button
                    onClick={handleArchive}
                    disabled={updateStatusMutation.isPending}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {!conflictsError && conflictsData?.conflicts && conflictsData.conflicts.length > 0 && (
          <ConflictBanner conflicts={conflictsData.conflicts} />
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <TimetableGrid timetable={timetable} readOnly={!isDraft || !userIsAdmin} />
        </div>
      </div>
    </>
  );
}

