export class CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  hireDate?: Date;
  salary?: number;
  positionId?: string;  
}
