import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'
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
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handle: (req, res ) => {
      const { title, description } = req.body

      if ( !title || !description ) {
        return res.writeHead(404).end(JSON.stringify({message: 'Deve ser informado o title e description'}))
      }

      database.insert('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      })

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handle: (req, res ) => {
      const { id } = req.params

      if(database.delete('tasks', id)) {
        return res.writeHead(204).end()
      } else {
        return res.writeHead(400).end(JSON.stringify({message: 'task does not exist'}))
      }     
    }
  },
]