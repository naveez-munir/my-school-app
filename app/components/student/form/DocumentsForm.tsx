import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  DocumentType,
  type AddDocumentDto,
  type Student,
} from "~/types/student";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { PhotoUpload } from "./PhotoUpload";
import { useAddStudentDocument } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import toast from "react-hot-toast";

export function DocumentsForm() {
  const { id } = useParams<{ id: string }>();
  const { student, isLoadingStudent } = useStudentForm<{}>({
    initialDataMapper: () => ({}),
    defaultData: {},
    mutationHook: useAddStudentDocument,
    entityName: "Student documents",
  });

  const addDocumentMutation = useAddStudentDocument();

  const [documents, setDocuments] = useState<Student["documents"]>([]);
  const [newDocument, setNewDocument] = useState<Partial<AddDocumentDto>>({
    documentType: "",
    documentUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (student && student.documents) {
      setDocuments(student.documents);
    }
  }, [student]);

  const handleAddDocument = async () => {
    if (!id || !newDocument.documentType || !newDocument.documentUrl) return;

    const toastId = toast.loading("Adding document...");

    try {
      setIsSubmitting(true);
      await addDocumentMutation.mutateAsync({
        id,
        data: newDocument as AddDocumentDto,
      });
      setNewDocument({
        documentType: "",
        documentUrl: "",
      });
    } catch (error) {
      console.error("Failed to add document:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add document";

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    console.log("Remove document at index:", index);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  };

  return (
    <StudentFormLayout
      student={student}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isSubmitting}
      title="Manage Student Documents"
      description={`Update documents and photo for {studentName}.`}
      onSubmit={handleSubmit}
      studentId={id}
    >
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">Student Photo</h3>
        <p className="mt-1 text-sm text-gray-600">
          Upload a clear, recent photo of the student.
        </p>
        <div className="mt-4">
          <PhotoUpload
            currentPhoto={student?.photoUrl || ""}
            onPhotoChange={(url) => {
              console.log("Update photo:", url);
              toast.error("Photo update not implemented yet");
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Student Documents</h3>
        <p className="mt-1 text-sm text-gray-600">
          Upload important student documents such as birth certificate, previous
          school records, etc.
        </p>

        {documents && documents.length > 0 && (
          <div className="mt-4 border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.documentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadDate
                        ? new Date(doc.uploadDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput<typeof DocumentType>
            label="Document Type"
            value={newDocument.documentType as DocumentType}
            options={DocumentType}
            onChange={(value) =>
              setNewDocument((prev) => ({ ...prev, documentType: value }))
            }
            placeholder="Select document type"
          />
          <div>
            <label
              htmlFor="documentUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Document URL/Path
            </label>
            <input
              type="text"
              id="documentUrl"
              value={newDocument.documentUrl || ""}
              onChange={(e) =>
                setNewDocument((prev) => ({
                  ...prev,
                  documentUrl: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="URL or path to document"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddDocument}
              disabled={
                !newDocument.documentType ||
                !newDocument.documentUrl ||
                isSubmitting ||
                addDocumentMutation.isPending
              }
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting || addDocumentMutation.isPending
                ? "Adding..."
                : "Add Document"}
            </button>
          </div>
        </div>
      </div>
    </StudentFormLayout>
  );
}
