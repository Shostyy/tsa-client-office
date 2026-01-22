export interface BranchOffice {
  id: number;
  name: string;
}

export interface BranchOfficeUpdateEvent {
  type: 'update' | 'error' | 'connected';
  data?: BranchOffice[];
  message?: string;
}