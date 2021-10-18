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
        if (res.message === 'success to apply font')
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


// @import url(//fonts.googleapis.com/earlyaccess/jejumyeongjo.css);

// .jejumyeongjo * { 
//  font-family: 'Jeju Myeongjo', serif;
// }

// @font-face {
//   font-family: 'SBAggroB';
//   src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff') format('woff');
//   font-weight: normal;
//   font-style: normal;
// }

// @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');
