import { useNavigate } from "react-router";
import LoadingSpinner from "~/components/common/ui/loader/loading";
import NotFoundMessage from "~/components/common/ui/notFound/NotFoundMessage";
import type { StudentFormLayoutProps } from "~/types/student";
export function StudentFormLayout({
  student,
  isLoadingStudent,
  isSubmitting,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  className = "",
  studentId,
}: StudentFormLayoutProps) {
  const navigate = useNavigate();
  if (isLoadingStudent) {
    return <LoadingSpinner />;
  }
  if (!student) {
    return (
      <NotFoundMessage
        title="Student not found"
        buttonText="Back to students list"
        onButtonClick={() => navigate("/dashboard/students")}
      />
    );
  }

  const studentName = student ? `${student.firstName} ${student.lastName}` : "";
  const handleCancel =
    onCancel ||
    (() => {
      if (studentId) {
        navigate(`/dashboard/students/${studentId}`);
      } else {
        navigate("/dashboard/students");
      }
    });

  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 ${className}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description &&
          (typeof description === "string" ? (
            <p className="mt-2 text-sm text-gray-600">
              {description.replace("{studentName}", studentName)}
            </p>
          ) : (
            description
          ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {children}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
