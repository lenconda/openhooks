import { Repository } from 'typeorm'

export const fetchWithPagination =
    async <T>(page: number, model: Repository<T>): Promise<T[]> => {
  const result =
      await model.find({ skip: (page - 1) * 10, take: 10 })
  return result
}

export const hasNext =
    async <T>(page: number, model: Repository<T>): Promise<boolean> => {
  const { length } =
      await model.find({ skip: page * 10, take: 10 })
  return length !== 0
}
