import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('oh_logs')
export class Logs {

  @PrimaryColumn({ name: 'uuid' })
  uuid!: string

  @PrimaryColumn({ name: 'router_id' })
  routerId?: string

  @Column({ name: 'trigger_time' })
  triggerTime?: string

  @Column({ name: 'result' })
  result?: string

  @Column({ name: 'succeeded' })
  succeeded?: boolean

}

export default Logs
