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

export const getPages = async <T>(model: Repository<T>): Promise<number> => {
  const count = await model.count()
  const pages = Math.floor(count / 10) + (count % 10 === 0 ? 0 : 1)
  return pages
}
