import { TenantConfigTable } from "./TenantConfigTable";
import { useNavigate } from "react-router";
import { useTenants } from "~/hooks/useTenantQueries";
import type { Tenant } from "~/types/tenant";

export function TenantConfigSection() {
  const navigate = useNavigate();
  const { data: tenants = [], isLoading: loading, error } = useTenants();

  const handleConfigEdit = (tenant: Tenant) => {
    navigate(`/admin/tenant-config/${tenant._id}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700">
          Tenant Configuration
        </h1>
        <p className="text-sm text-gray-500">
          Configure tenant-specific settings, leave policies, and system preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <h4 className="text-gray-500">Loading tenant configurations...</h4>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message || "An error occurred while loading tenant configurations"}
          </div>
        ) : (
          <TenantConfigTable
            data={tenants}
            onConfigEdit={handleConfigEdit}
          />
        )}
      </div>
    </div>
  );
}