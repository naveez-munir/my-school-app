import { subjectApi } from "~/services/subjectApi";
import type { Route } from "./+types";
import { useLoaderData, useNavigation } from "react-router";
import type { Subject } from "~/types/subject";
import { SubjectsSkeleton } from "~/components/subjects/SubjectsSkeleton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Management" },
    { name: "description", content: "Manage school courses and curriculum" },
  ];
}

export const clientLoader = async () => {
  try {
    const subjects = await subjectApi.getAll();
    return { subjects };
  } catch (error) {
    console.log('>>>>', error)
    // return { error: error.message };//TODO need to fix this
  }
};

export default function Courses() {
  const { subjects, error } = useLoaderData<{ subjects: Subject[], error?: string }>();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Course Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Course
        </button>
      </div>

      {isLoading ? (
        <SubjectsSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects?.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.subjectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {subject.subjectCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(subject.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subjects?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No courses found. Add a new course to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
