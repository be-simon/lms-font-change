const root = document.documentElement

chrome.runtime.onMessage.addListener(req => {
    if (req.message === 'send web font text') {
        const fontObj = webFontParsing(req.content)
        console.log(fontObj)
        applyFont(fontObj)
    }
})

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
                    if (key === 'font-family'){
                        value = value.split(',')[0].slice(1, -1)
                    }
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
                    if (key === 'font-family'){
                        value = value.slice(1, -1)
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

    const webfont = new FontFace(family, src, des);
    webfont.load().then(f => {
        root.style.fontFamily = family
        document.body.style.fontFamily = family
        
        fontVariables = Array.from(document.styleSheets)
        .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
        .reduce((acc, sheet) =>
            (acc = [...acc, ...Array.from(sheet.cssRules).reduce((def, rule) =>
                (def = rule.selectorText === ":root"
                    ? [...def, ...Array.from(rule.style).filter(name => name.endsWith("-fontFamily"))]
                    : def), [])
            ]), []);
        
        fontVariables.forEach(f => root.style.setProperty(f, family))
        // fontVariables.forEach(f => console.log(f))
        
        const newStyle = document.createElement('style')
        const cssText = `{font-family: ${family};}`
        document.head.appendChild(newStyle)
        newStyle.sheet.insertRule('h1, h2, h3, h4, h5, h6' + cssText, 0)
        newStyle.sheet.insertRule('input, button, select, textarea' + cssText, 0)
    })   
}