import moment from 'moment'

export function formatTs (ts, format = 'YYYY-MM-DD HH:mm:ss') {
  let retVal = ''
  if (ts) {
    let time = moment(ts)
    retVal = time.format(format)
    // debug && console.debug(`${ts} => ${retVal}(${time.format()})`)
  }
  return retVal
}
