const message = document.getElementById('message') as HTMLElement
const form = document.getElementById('uploadForm') as HTMLFormElement
const file = document.getElementById('data') as HTMLInputElement
const labelFile = document.getElementById('labelData') as HTMLLabelElement
const formBtns = document.querySelectorAll('.hiddenBtn') as NodeListOf<HTMLElement>
const sendBtn = document.getElementById('send') as HTMLButtonElement
const cancelBtn = document.getElementById('cancel') as HTMLButtonElement
const resetBtn = document.getElementById('reset') as HTMLButtonElement

let mediaRecorder: MediaRecorder | null = null
let blob: Blob | null = null
let url: string | null = null
const chunks: BlobPart[] = []

const labelText = labelFile.textContent

let controller: AbortController = new AbortController()

const changeStateBtns = (state: boolean) => {
  formBtns.forEach(btn => {
    btn.style.display = state ? 'block' : 'none'
  })
}

const resetAll = () => {
  labelFile.textContent = labelText
  changeStateBtns(false)
  file.value = ''
  if (mediaRecorder) mediaRecorder.stop()
  if (url) URL.revokeObjectURL(url)
  controller.abort()
}

const sendForm = async () => {
  if (file.value === '') {
    message.style.display = 'block'
    message.textContent = 'Select a file to send'
    return
  }

  changeStateBtns(false)
  cancelBtn.style.display = 'block'

  const formData = new FormData(form)

  message.style.display = 'block'
  message.textContent = 'Sending...'

  controller = new AbortController()

  try {
    const response: Response = await fetch('/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    const data = await response.json()

    if (!response.ok) {
      message.textContent = data.message

      changeStateBtns(true)
      cancelBtn.style.display = 'none'
      return
    }

    message.textContent = `Sent successfully`

    resetAll()
    message.innerHTML = `The video was uploaded successfully: <a href="${data.video_link}" target="_blank">Link</a>`
  } catch (error: any) {
    message.style.display = 'block'

    if (error.name === 'AbortError') {
      message.textContent = 'Request aborted'
      return
    }

    message.textContent = error.message
  }
}

const abortRecording = () => {
  controller.abort()
  changeStateBtns(true)
  cancelBtn.style.display = 'none'
}

file?.addEventListener('change', () => {
  const data = file.files
  if(!data?.length){
    resetAll()
    message.style.display = 'none'
    return
  }

  changeStateBtns(true)
  cancelBtn.style.display = 'none'

  labelFile.textContent = data[0].name
})

resetBtn?.addEventListener('click', () => {
  resetAll()
  message.style.display = 'none'
})

form?.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  sendForm()
})

cancelBtn?.addEventListener('click', (e: Event) => {
  e.preventDefault()
  abortRecording()
  console.log('cancelado')
})
