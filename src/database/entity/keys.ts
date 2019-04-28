import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('oh_keys')
export class Keys {

  @PrimaryColumn({ name: 'value' })
  value!: string

  @Column({ name: 'create_time' })
  createTime?: string

}

export default Keys
