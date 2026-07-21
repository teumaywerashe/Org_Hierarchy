import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.VIEWER })
  role: Role;
}
