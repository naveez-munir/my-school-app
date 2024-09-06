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
    <div className={`mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 ${className}`}>
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-responsive-xl font-semibold text-gray-900">{title}</h1>
        {description &&
          (typeof description === "string" ? (
            <p className="mt-1 sm:mt-2 text-body-secondary">
              {description.replace("{studentName}", studentName)}
            </p>
          ) : (
            description
          ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={onSubmit} className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
          {children}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 lg:pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
