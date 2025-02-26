import { Plus, X, Upload } from 'lucide-react';
import type { Document } from '~/types/teacher';
import { TextInput } from '../common/form/inputs/TextInput';
import { DateInput } from '../common/form/inputs/DateInput';
import { FileInput } from '../common/form/inputs/FileInput';

interface DocumentsFormProps {
  data: Document[];
  onUpdate: (value: Document[]) => void;
}

export function DocumentsForm({ data = [], onUpdate }: DocumentsFormProps) {
  const handleAdd = () => {
    onUpdate([...data, {
      documentType: '',
      documentUrl: '',
      uploadDate: new Date()
    }]);
  };

  const handleRemove = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Document, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      {data.map((document, index) => (
        <div key={index} className="relative bg-gray-50 p-4 rounded-lg">
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
              label='Document Type'
              required
              value={document.documentType}
              onChange={(value) => handleChange(index, 'documentType', value)}
              placeholder='e.g., CV, Certificate, ID Card'
            />

            <DateInput 
              label='Upload Date'
              value={document.uploadDate ? new Date(document.uploadDate).toISOString().split('T')[0] : ''}
              onChange={(value) => handleChange(index, 'uploadDate', new Date(value))}
              required
            />
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Document URL*</label>
              <div className="mt-1 flex items-center">
                <input
                  type="url"
                  value={document.documentUrl}
                  onChange={(e) => handleChange(index, 'documentUrl', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
                <button
                  type="button"
                  className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div> */}
            <FileInput
              value={document.documentUrl}
              onChange={(fileInfo) => {
                console.log('>>>>>>', fileInfo)
                // This might be just a filename or potentially a partial path in dev
                handleChange(index, 'documentUrl', fileInfo);
              }}
              required
            />

          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Document
      </button>
    </div>
  );
}
