import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DocumentType,
  type Student,
  type UpdatePersonalInfoDto,
} from "~/types/student";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormField } from "~/components/common/form/FormField";
import { PhotoUpload } from "./PhotoUpload";
import { DocumentUploader } from "./DocumentUploader";
import { useAddStudentDocument, useUpdatePersonalInfo } from "~/hooks/useStudentQueries";
import { useStudentForm } from "~/hooks/forms/useStudentForm";
import { StudentFormLayout } from "./StudentFormLayout";
import { documentSchema, type DocumentFormData } from "~/utils/validation/studentValidation";
import toast from "react-hot-toast";

export function DocumentsForm() {
  const { id } = useParams<{ id: string }>();
  const {
    student,
    formData,
    handleChange,
    handleSubmit,
    isLoadingStudent,
    isPending: isPhotoUpdatePending,
  } = useStudentForm<UpdatePersonalInfoDto>({
    initialDataMapper: (student) => ({
      photoUrl: student.photoUrl || "",
    }),
    defaultData: {
      photoUrl: "",
    },
    mutationHook: useUpdatePersonalInfo,
    entityName: "Student photo",
  });

  const addDocumentMutation = useAddStudentDocument();

  const [documents, setDocuments] = useState<Student["documents"]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form validation for adding documents
  const {
    control: documentControl,
    handleSubmit: handleDocumentSubmit,
    formState: { errors: documentErrors },
    reset: resetDocumentForm,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: "",
      documentUrl: "",
    },
  });

  useEffect(() => {
    if (student && student.documents) {
      setDocuments(student.documents);
    }
  }, [student]);

  const handleAddDocument = async (validatedData: DocumentFormData) => {
    if (!id) return;

    const toastId = toast.loading("Adding document...");

    try {
      setIsSubmitting(true);
      await addDocumentMutation.mutateAsync({
        id,
        data: validatedData,
      });
      resetDocumentForm();
      toast.success("Document added successfully", { id: toastId });
    } catch (error) {
      console.error("Failed to add document:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add document";

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (url: string) => {
    handleChange("photoUrl", url);
  };

  const handleRemoveDocument = (index: number) => {
    console.log("Remove document at index:", index);
    toast.error("Document removal not implemented yet");
  };

  return (
    <StudentFormLayout
      student={student || null}
      isLoadingStudent={isLoadingStudent}
      isSubmitting={isPhotoUpdatePending || isSubmitting}
      title="Manage Student Documents"
      description={`Update documents and photo for ${student?.firstName || ''} ${student?.lastName || ''}.`}
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
            currentPhoto={formData.photoUrl || ""}
            onPhotoChange={handlePhotoChange}
            folder={`students/${id}/profile`}
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
          <div className="mt-4 space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{doc.documentType}</h4>
                  <div>
                    {doc.uploadDate && (
                      <span className="text-sm text-gray-500 mr-4">
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <DocumentUploader
                  currentDocumentUrl={doc.documentUrl}
                  documentType={doc.documentType}
                  onDocumentChange={() => {}}
                  folder={`students/${id}/documents`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-4">Add New Document</h4>
          <form onSubmit={handleDocumentSubmit(handleAddDocument)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                name="documentType"
                control={documentControl}
                errors={documentErrors}
                render={(field) => (
                  <SelectInput<typeof DocumentType>
                    label="Document Type"
                    value={field.value as DocumentType}
                    options={DocumentType}
                    onChange={field.onChange}
                    placeholder="Select document type"
                  />
                )}
              />

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting || addDocumentMutation.isPending}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
                >
                  {isSubmitting || addDocumentMutation.isPending
                    ? "Adding..."
                    : "Add Document"}
                </button>
              </div>
            </div>

            <FormField
              name="documentUrl"
              control={documentControl}
              errors={documentErrors}
              render={(field) => (
                <DocumentUploader
                  currentDocumentUrl={field.value}
                  documentType="Document"
                  onDocumentChange={field.onChange}
                  folder={`students/${id}/documents`}
                  label="Upload Document"
                />
              )}
            />
          </form>
        </div>
      </div>
    </StudentFormLayout>
  );
}
