import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handle: (req, res ) => {

      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
]