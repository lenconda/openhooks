import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('oh_auths')
export class Auths {

  @PrimaryColumn({ name: 'hook_id' })
  hookId!: string

  @PrimaryColumn({ name: 'key' })
  key?: string

  @Column({ name: 'create_time' })
  createTime?: string

}

export default Auths
