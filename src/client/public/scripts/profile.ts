interface User {
  name: string
  picture: string | null
}

class Profile {
  profile: HTMLElement | null
  message: HTMLElement | null

  constructor() {
    this.profile = document.getElementById('profile')
    this.message = document.getElementById('message')
    this.init()
  }

  async init() {
    try {
      const data: Response = await fetch('/profile')
      const user: User = (await data.json()) ?? null

      if (!data.ok && this.message) {
        this.message.style.display = 'block'
        this.message.textContent = 'Error getting profile'
      }

      if (user && this.profile) {
        this.showProfile(user)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  async showProfile(user: User) {
    const title = document.createElement('h1')
    const img = document.createElement('img')

    title.id = 'name'
    title.textContent = user.name
    img.src = user.picture ?? ''
    img.alt = 'User picture'
    img.id = 'userPicture'

    this.profile?.appendChild(title)
    this.profile?.appendChild(img)
  }
}

new Profile()
