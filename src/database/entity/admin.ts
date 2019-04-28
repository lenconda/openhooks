import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('oh_admin')
export class Admin {

  @PrimaryColumn({ name: 'uuid' })
  uuid!: string

  @Column({ name: 'username' })
  username?: string

  @Column({ name: 'password' })
  password?: string

  @Column({ name: 'create_at' })
  createAt?: string

  @Column({ name: 'update_at' })
  updateAt?: string

}

export default Admin
