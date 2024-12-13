import { Clock, Zap, CheckCircle } from 'lucide-react';
import type { AutoGenerationMetadata } from '~/types/timetable';

interface GenerationMetadataCardProps {
  metadata: AutoGenerationMetadata;
}

export function GenerationMetadataCard({ metadata }: GenerationMetadataCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <Zap className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">Auto-Generation Info</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Algorithm</p>
            <p className="font-semibold text-gray-900">
              {metadata.algorithm.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Execution Time</p>
            <p className="font-semibold text-gray-900">
              {metadata.executionTimeMs}ms
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Conflicts Resolved</p>
            <p className="font-semibold text-gray-900">
              {metadata.conflictsResolved}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Generated on {new Date(metadata.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

