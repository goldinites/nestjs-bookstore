import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '@/modules/user/enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 75 })
  firstName: string;

  @Column({ length: 75 })
  lastName: string;

  @Column({ length: 128, unique: true })
  email: string;

  @Column({ length: 256 })
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.GHOST })
  role: Roles;
}
