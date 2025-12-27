
export type Equipment = {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  department: string;
  assignedEmployee: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
  isScrapped: boolean;
  maintenanceFrequency: number; // in days
  imageUrl: string;
  imageHint: string;
};

export type MaintenanceRequest = {
  id: string;
  subject: string;
  equipmentId: string;
  teamId: string;
  technicianId: string;
  type: 'corrective' | 'preventive';
  status: 'new' | 'in_progress' | 'repaired' | 'scrap';
  priority: 'High' | 'Medium' | 'Low';
  scheduledDate: Date;
  duration: number; // in hours
  rootCause: string;
  createdBy: string;
};

export type Team = {
  id: string;
  name: string;
  members: string[]; // array of technician IDs
};

export type Technician = {
  id: string;
  name: string;
  workload: number;
};

export type UserRole = 'Employee' | 'Technician' | 'Manager';
