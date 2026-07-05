import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('position')
export class PositionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ApiProperty()
  @Column({ length: 150 })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => PositionEntity, (position) => position.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent: PositionEntity;

  @OneToMany(() => PositionEntity, (position) => position.parent)
  children: PositionEntity[];
}
