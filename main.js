const root = document.documentElement

chrome.runtime.onMessage.addListener(req => {
    if (req.message === 'send web font text') {
        const fontObj = webFontParsing(req.content)
        chrome.storage.local.set({'fontObj': fontObj}, function() {
            location.reload()
        });
    }
})

new Promise((resolve, reject) => {
    chrome.storage.local.get(['fontObj'], function(fontObj) {
        const err = chrome.runtime.lastError
        if (err) reject(err)
        else resolve(fontObj) 
    });
}).then(o => applyFont(o.fontObj))


function webFontParsing(fontText) {
    const type = fontText.split(' ')[0]
    const lineList = fontText.split('\n')
    
    let fontObj = {}
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
                    if (key === 'src') {
                        value = `url(${value.split('\'')[1]})`
                    }
                    if (key.startsWith('font-'))
                        key = key.substring(5)
                    fontObj[key] = value
                }
            }
    }

    return fontObj
}

function applyFont(fontObj) {
    const src = fontObj.src
    const family = fontObj.family
    const des = {}
    for (let [k, v] of Object.entries(fontObj)) {
        if (k !== 'src' && k !== 'family')
            des[k] = v
    }
    console.log(family)
    console.log(src)
    console.log(des)
    const webfont = new FontFace(family, src, des);
    webfont.load().then(f => {
        // console.log(f)
        root.style.fontFamily = f.family
        document.body.style.fontFamily = f.family
        
        fontVariables = Array.from(document.styleSheets)
        .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
        .reduce((acc, sheet) =>
            (acc = [...acc, ...Array.from(sheet.cssRules).reduce((def, rule) =>
                (def = rule.selectorText === ":root"
                    ? [...def, ...Array.from(rule.style).filter(name => name.endsWith("-fontFamily"))]
                    : def), [])
            ]), []);
        
        fontVariables.forEach(fn => root.style.setProperty(fn, f.family))
        // fontVariables.forEach(f => console.log(f))
        
        // const newStyle = document.createElement('style')
        // const cssText = `{font-family: "${f.family}";}`
        // document.head.appendChild(newStyle)
        // newStyle.sheet.insertRule('h1, h2, h3, h4, h5, h6' + cssText, 0)
        // newStyle.sheet.insertRule('input, button, select, textarea' + cssText, 0)
    })   
}