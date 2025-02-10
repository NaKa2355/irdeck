export const copyText = (str: string): void => {
  const textArea = document.createElement('textArea')
  textArea.id = 'temp'
  textArea.style.position = 'fixed'
  textArea.style.right = '100vw'
  textArea.style.fontSize = '16px'
  textArea.setAttribute('readonly', 'readonly')
  textArea.textContent = str
  document.body.appendChild(textArea)
  const elm = document.getElementById('temp') as HTMLTextAreaElement
  elm.select()
  const range = document.createRange()
  range.selectNodeContents(elm)
  const sel = window.getSelection()
  if (sel !== null) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
  elm.setSelectionRange(0, 999999)
  document.execCommand('copy')
  document.body.removeChild(textArea)
}
