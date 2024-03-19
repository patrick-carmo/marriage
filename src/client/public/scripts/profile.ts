const profile = document.querySelector('#profile') as HTMLDivElement

(async () => {
  {
    try {
      const data: Response = await fetch('/profile')
      const user = await data.json()

      if (data.ok) {
        if (profile) {
          profile.innerHTML = `
        <h1>Welcome ${user.name}</h1>
        <img src="${user.picture}" alt="User picture">
      `
          return
        }
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }
})()
