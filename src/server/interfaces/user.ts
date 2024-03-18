interface User {
  id: number
  google_id: string
  name: string
  email: string
  picture?: string
  last_login: Date
  created_at: Date
}

export { User }
