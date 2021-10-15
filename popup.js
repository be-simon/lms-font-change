const textarea = document.getElementById('textarea')
const submitBtn = document.getElementById('submit_btn')

setCurFontText()

submitBtn.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true})
    .then(tabs => {
      const req = {
        "message": "send web font text",
        "content": textarea.value
      }
      chrome.tabs.sendMessage(tabs[0].id, req, (res) => {
        setCurFontText()
      })
    })
}

function setCurFontText() {
  const curFont = document.getElementById('cur_font')

  chrome.storage.local.get(['fontObj'], function(obj) {
    curFont.innerHTML = obj.fontObj.family ?? ''
  })
}
