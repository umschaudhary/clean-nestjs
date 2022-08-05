import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  firstName: string

  @Column({ length: 100 })
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({})
  password: string

  @Column({ default: true })
  isActive: boolean

  @Column()
  last_logn?: Date

  @Column()
  created_at?: Date

  @Column()
  updated_at?: Date
}
