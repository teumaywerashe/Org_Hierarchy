import api from "@/lib/axios";
import { Employee, EmployeePayload } from "@/types/employee";

export const employeeService = {
  getAll: () => api.get<Employee[]>("/employee").then((r) => r.data),
  create: (data: EmployeePayload) =>
    api.post<Employee>("/employee", data).then((r) => r.data),
  update: (id: string, data: EmployeePayload) =>
    api.patch<Employee>(`/employee/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/employee/${id}`),
};
