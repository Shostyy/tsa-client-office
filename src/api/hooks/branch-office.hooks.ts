import { useQuery } from "@tanstack/react-query";
import { useSSEUpdate } from "./_update.hooks";
import { branchOfficesService } from "../services/branch-offices.service";

export function useBranchOffices() {
  return useQuery({
    queryKey: ["branch-offices"],
    queryFn: async () => {
      const response = await branchOfficesService.getAll();
      return response.data;
    },
  });
}

export function useBranchOfficeUpdate() {
  return useSSEUpdate("branch-offices", branchOfficesService, [
    "branch-offices",
  ]);
}
