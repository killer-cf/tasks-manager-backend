import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value])=> {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
      const row = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = { 
        ...row,
        title: data.title ? data.title : row.title,
        description: data.description ? data.description : row.description,
        updated_at: new Date()
      }
      this.#persist()

      return true
    }

    return false
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
      const row = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = { 
        ...row,
        completed_at: new Date(), 
        updated_at: new Date()
      }
      this.#persist()

      return true
    }

    return false
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1){
      this.#database[table].splice(rowIndex, 1)
      this.#persist()

      return true
    }

    return false
  }
}