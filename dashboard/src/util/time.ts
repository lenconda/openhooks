import moment from 'moment'

export const getFormattedTime = (timestamp: string | undefined): string => {
  if (timestamp)
    return moment(parseInt(timestamp)).format('YYYY-MM-DD HH:mm:ss')
  else
    return 'unknown'
}
