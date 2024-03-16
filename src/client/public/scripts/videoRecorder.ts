const message = document.getElementById('message') as HTMLElement
const form = document.getElementById('uploadForm') as HTMLFormElement
const file = document.getElementById('data') as HTMLInputElement
const labelFile = document.getElementById('labelData') as HTMLLabelElement
const formBtns = document.querySelectorAll('.hiddenBtn') as NodeListOf<HTMLElement>
const sendBtn = document.getElementById('send') as HTMLButtonElement
const resetBtn = document.getElementById('reset') as HTMLButtonElement
const progressBar = document.getElementById('progressBar') as HTMLProgressElement

let mediaRecorder: MediaRecorder | null = null
let blob: Blob | null = null
let url: string | null = null
const chunks: BlobPart[] = []

const labelText = labelFile.textContent

const changeStateBtns = (state: boolean) => {
  formBtns.forEach(btn => {
    btn.style.display = state ? 'block' : 'none'
  })
}

let progressInterval: NodeJS.Timeout

const updateProgressBar = async () => {
  try {
    const response = await fetch('/progress')

    if (!response.ok) {
      message.textContent = 'Error updating progress bar'
      clearInterval(progressInterval)
      return
    }

    const data = await response.json()

    if (data.progress > 0 && data.progress < 100) {
      message.textContent = `Uploading... ${data.progress}%`
    }

    progressBar.value = data.progress
  } catch (error) {
    clearInterval(progressInterval)
    message.textContent = 'Error updating progress bar'
  }
}

const resetAll = () => {
  file.disabled = false
  labelFile.textContent = labelText
  changeStateBtns(false)
  file.value = ''
  if (mediaRecorder) mediaRecorder.stop()
  if (url) URL.revokeObjectURL(url)
  if (progressInterval) clearInterval(progressInterval)
  progressBar.style.display = 'none'
  progressBar.value = 0
}

const sendForm = async () => {
  progressBar.style.display = 'block'
  message.style.display = 'block'

  if (file.value === '') {
    message.textContent = 'Select a file to send'
    return
  }

  changeStateBtns(false)

  const formData = new FormData(form)
  message.textContent = 'Starting the upload...'

  try {
    file.disabled = true

    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message

      changeStateBtns(true)
      return
    }

    message.textContent = `Sent successfully`

    resetAll()
    message.innerHTML = `The video was uploaded successfully: <a href="${data.video_link}" target="_blank">Link</a>`
  } catch (error: any) {
    resetAll()
    message.style.display = 'block'
    message.textContent = error.message
  } finally {
    clearInterval(progressInterval)
    progressBar.style.display = 'none'
    progressBar.value = 0
  }
}

file?.addEventListener('change', () => {
  const data = file.files
  if (!data?.length) {
    resetAll()
    message.style.display = 'none'
    return
  }

  changeStateBtns(true)

  labelFile.textContent = data[0].name
})

resetBtn?.addEventListener('click', () => {
  resetAll()
  message.style.display = 'none'
})

form?.addEventListener('submit', e => {
  e.preventDefault()
  progressInterval = setInterval(updateProgressBar, 2000)
  progressBar.style.display = 'block'
  sendForm()
})
