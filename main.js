const root = document.documentElement
const errMsg = '웹 폰트 서식이 올바르지 않습니다.\n다시 입력해주세요.'

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.message === 'send web font text') {
    try {
      const fontObj = webFontParsing(req.content)
      chrome.storage.local.set({'fontObj': fontObj})
      sendResponse({res: 'success to apply font'})
      location.reload()
    } catch (err) {
      alert(errMsg)
    }
  }
})


new Promise((resolve, reject) => {
  chrome.storage.local.get(['fontObj'], function(fontObj) {
    const err = chrome.runtime.lastError
    if (err) reject(err)
    else resolve(fontObj) 
  });
}).then(obj => loadWebFont(obj.fontObj))
.then(fontRes => applyFont(fontRes))
.catch(err => alert(errMsg))


function webFontParsing(fontText) {
  const type = fontText.split(' ')[0]
  const lineList = fontText.split('\n')
  
  let fontObj = {}
  try {
    switch (type) {
      case '@import':
        fontObj.src = lineList[0].split(' ')[1].slice(0, -1)
        for (l of lineList) {
          let [key, value] = l.split(': ')
          if (value){
            key = key.replace(/\s/g, '')
            value = value.slice(0, -1)
            if (key === 'font-family')
              value = value.split(',')[0].slice(1, -1)
            if (key.startsWith('font-'))
              key = key.substring(5)
            fontObj[key] = value
          }
        }
        
        case '@font-face':
          for (l of lineList) {
            let [key, value] = l.split(': ')
            if (value) {
              key = key.replace(/\s/g, '')
              value = value.slice(0, -1)
              if (key === 'font-family')
              value = value.slice(1, -1)
              if (key === 'src')
                value = `url(${value.split('\'')[1]})`
              if (key.startsWith('font-'))
                key = key.substring(5)
              fontObj[key] = value
            }
          }
        }

      if (!Object.keys(fontObj).length)
        throw 'empty font object'

      return fontObj
  } catch (err) {
    throw err
  }
}

function getAllFamilyProperty() {
  return Array.from(document.styleSheets)
    .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
    .reduce((acc, sheet) =>
    (acc = [...acc, ...Array.from(sheet.cssRules).reduce((def, rule) =>
      (def = rule.selectorText === ":root"
      ? [...def, ...Array.from(rule.style).filter(name => name.endsWith("-fontFamily"))]
      : def), [])
    ]), []);
}

function loadWebFont(fontObj) {
  const src = fontObj.src
  const family = fontObj.family
  const des = {}
  for (let [k, v] of Object.entries(fontObj)) {
    if (k !== 'src' && k !== 'family')
      des[k] = v
  }

  const webfont = new FontFace(family, src, des);
  return webfont.load()
}

function applyFont(webFontRes) {
  document.fonts.add(webFontRes)
  const newFontFamily = webFontRes.family

  fontVariables = getAllFamilyProperty()
  fontVariables.forEach(fn => root.style.setProperty(fn, newFontFamily))
  
  root.style.fontFamily = newFontFamily
  document.body.style.fontFamily = newFontFamily
  root.style.setProperty('--fbyHH-fontFamily', newFontFamily)
  root.style.setProperty('--emyav-fontFamily', newFontFamily)
  
  // const iframeDocument = document.getElementById('tool_content').contentWindow.document
  // iframeDocument.body.onload = () => console.log('frame loaded')
  // fontVariables.forEach(fn => iframeDocumentRoot.style.setProperty(fn, f.family))
  // iframeDocumentRoot.documentElement.style.fontFamily = f.family

  const newStyle = document.createElement('style')
  const cssText = `{font-family: "${newFontFamily}";}`
  document.head.appendChild(newStyle)
  newStyle.sheet.insertRule('h1, h2, h3, h4, h5, h6' + cssText, 0)
  newStyle.sheet.insertRule('input, button, select, textarea' + cssText, 0)
}