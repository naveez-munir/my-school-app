import { TenantsTable } from "./TenantsTable";
import { useNavigate } from "react-router";
import type { Tenant } from "~/types/tenant";
import { useTenants, useDeleteTenant } from "~/hooks/useTenantQueries";

export function TenantSection() {
  const navigate = useNavigate();

  // React Query hooks
  const { data: tenants = [], isLoading: loading, error } = useTenants();
  const deleteTenantMutation = useDeleteTenant();

  const handleDelete = async(id: string) => {
    if (window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      deleteTenantMutation.mutate(id);
    }
  };

  const handleEdit = (tenant: Tenant) => {
    navigate(`/admin/tenants/${tenant._id}`);
  };

  const handleAdd = () => {
    navigate('/admin/tenants/new');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Tenant Management</h1>
          <p className="text-sm text-gray-500">
            Create, manage, and configure tenants across the system
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Tenant
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <h4 className="text-gray-500">Loading tenants...</h4>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message || "An error occurred while loading tenants"}
          </div>
        ) : (
          <TenantsTable
            data={tenants}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

    </div>
  );
}