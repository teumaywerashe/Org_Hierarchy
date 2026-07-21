export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  hireDate: string | null;
  salary: string | number | null;
  positionId: string | null;
}

export interface EmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  hireDate?: string;
  salary?: number | null;
  positionId?: string | null;
}
