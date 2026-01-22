import { apiClient } from "./../clients/api-client";
import { BranchOffice } from "../types";
import { createUpdateService, extendUpdateService } from "./_update.service";
import { AxiosResponse } from "axios";

const baseService = createUpdateService<BranchOffice[]>({
  subscribeEndpoint: "/sse/subscribe/update-branch-offices",
  initializeEndpoint: "/api/branch-offices/update",
  queryKey: ["branch-offices"],
});

export const branchOfficesService = extendUpdateService(baseService, {
  getAll: (): Promise<AxiosResponse<BranchOffice[]>> => {
    return apiClient.get<BranchOffice[]>("/api/branch-offices");
  },
});
