"use client";
import {
  useBranchOffices,
  useBranchOfficeUpdate,
} from "@/api/hooks/branch-office.hooks";

export function BranchOfficesManager() {
  const { data: branchOffices, isLoading } = useBranchOffices();
  const { initiateUpdate } = useBranchOfficeUpdate();

  const handleUpdate = async () => {
    try {
      await initiateUpdate();
    } catch (error) {
      console.error("Failed to start update:", error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleUpdate}>Update Branch Offices</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                ID
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Name
              </th>
            </tr>
          </thead>
          <tbody>
            {branchOffices?.map((office) => (
              <tr key={office.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {office.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {office.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && (!branchOffices || branchOffices.length === 0) && (
        <p>No branch offices found.</p>
      )}
    </div>
  );
}

export default BranchOfficesManager;
