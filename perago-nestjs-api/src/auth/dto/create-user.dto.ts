import { Role } from '../../user/role.enum';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: Role;
}
