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

const changeStateBtns = (stateOrId: boolean | null | string) => {
  formBtns.forEach(btn => {
    if (stateOrId === true) {
      btn.style.display = 'block'
      return
    }
    if (stateOrId === false) {
      btn.style.display = 'none'
      return
    }
    if (btn.id === stateOrId) return

    const computedStyle = window.getComputedStyle(btn)
    const actualState = computedStyle.getPropertyValue('display')
    btn.style.display = actualState === 'none' ? 'block' : 'none'
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

let tmpMessage: NodeJS.Timeout

const displayTmpMessage = (msg: string, time: number) => {
  message.style.display = 'block'
  message.textContent = msg
  tmpMessage = setTimeout(() => {
    message.style.display = 'none'
  }, time)
}

const sendForm = async () => {
  if (file.value === '') {
    displayTmpMessage('Please select a file', 5000)
    return
  }

  cancelBtn.style.display = 'block'
  changeStateBtns('cancel')

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
      return
    }

    message.textContent = `Sent successfully`

    resetAll()
    message.innerHTML = `The video was uploaded successfully: <a href="${data.video_link}" target="_blank">Link</a>`
  } catch (error: any) {
    if (error.name === 'AbortError') {
      displayTmpMessage('Upload canceled', 5000)
      return
    }
    displayTmpMessage(error.message, 5000)
  }
}

const abortRecording = () => {
  controller.abort()
  cancelBtn.style.display = 'none'
  resetBtn.style.display = 'block'
  sendBtn.style.display = 'block'
}

file?.addEventListener('change', () => {
  if (file.value !== '' && file.files !== null) {
    const fileName = file.files[0].name
    labelFile.textContent = fileName
    changeStateBtns('cancel')
  }
})

resetBtn?.addEventListener('click', () => {
  resetAll()
  message.style.display = 'none'
})

form?.addEventListener('submit', e => {
  e.preventDefault()
  sendForm()
})

cancelBtn?.addEventListener('click', () => {
  abortRecording()
})
