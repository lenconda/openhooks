import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('oh_routers')
export class Routers {

  @PrimaryColumn({ name: 'uuid' })
  uuid!: string

  @Column({ name: 'description' })
  description?: string

  @Column({ name: 'command' })
  command?: string

  @Column({ name: 'create_time' })
  createTime?: string

  @Column({ name: 'update_time' })
  updateTime?: string

  @Column({ name: 'auth' })
  auth?: boolean

}

export default Routers
