import {ApiProperty }from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
 
} from 'typeorm'

@Entity('employee')
export class Employee {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty()
  @Column({ length: 150, unique: true })
  email: string;

  @ApiProperty()
  @Column({ length: 20, nullable: true })
  phoneNumber: string | null;

  @ApiProperty()
  @Column({ type: 'date', nullable: true })
  hireDate: Date | null;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number | null;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  positionId: string | null;
}
