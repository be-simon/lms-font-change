const root = document.documentElement
// const color = '#ba9a88'
// const color_sub = '#5b828e'
// root.style.setProperty('--ic-brand-global-nav-bgd', color)
// root.style.setProperty('--ic-brand-global-nav-logo-bgd', color)
// root.style.setProperty('--ic-brand-global-nav-menu-item__text-color--active', color)
// root.style.setProperty('--ic-brand-primary', color)

// root.style.setProperty('--ic-link-color', color_sub)
// root.style.setProperty('--ic-link-color-darkened-10', color_sub)
// root.style.setProperty('--ic-link-color-lightened-10', color_sub)
// root.style.setProperty('--eHiXd-linkColor', color_sub)

chrome.runtime.onMessage.addListener(req => {
    if (req.message === 'send web font text') {
        console.log(req.content)
    }
})



const webfont = new FontFace('GowunBatang-Regular', 'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff)', { style: 'normal', weight: 'normal' });
webfont.load().then(f => {
    const fontName = f.family
    root.style.fontFamily = fontName
    document.body.style.fontFamily = fontName
    // root.style.setProperty('--emyav-fontFamily', fontName)
    // root.style.setProperty('--eHiXd-fontFamily', fontName)
    // root.style.setProperty('--bbhNB-fontFamily', fontName)
    // root.style.setProperty('--eHiXd-fontFamily', fontName)
    // root.style.setProperty('--bDzpk-fontFamily', fontName)
    // root.style.setProperty('--fQfxa-fontFamily', fontName)


    fontVariables = Array.from(document.styleSheets)
    .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
    .reduce((acc, sheet) =>
        (acc = [...acc, ...Array.from(sheet.cssRules).reduce((def, rule) =>
              (def = rule.selectorText === ":root"
                  ? [...def, ...Array.from(rule.style).filter(name => name.endsWith("-fontFamily"))]
                  : def), [])
        ]), []);
    // fontVariables = Array.from(document.styleSheets)
    // .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
    // .reduce((acc, sheet) =>
    //     (acc = [...acc, ...Array.from(sheet.cssRules).reduce((def, rule) =>
    //           (def = [...def, ...Array.from(rule.style).filter(name => name.endsWith("-fontFamily"))
    //             ], []))
    //         ], [])
    //     );

    fontVariables.forEach(f => root.style.setProperty(f, fontName))
    fontVariables.forEach(f => console.log(f))

    const newStyle = document.createElement('style')
    const cssText = `{font-family: ${fontName};}`
    document.head.appendChild(newStyle)
    newStyle.sheet.insertRule('h1, h2, h3, h4, h5, h6' + cssText, 0)
    newStyle.sheet.insertRule('input, button, select, textarea' + cssText, 0)
    newStyle.sheet.insertRule('.fbyHH_bGBk' + cssText, 0)
})

// --ic-brand-primary-darkened-5: #00417D;
// --ic-brand-primary-darkened-10: #003E76;
// --ic-brand-primary-darkened-15: #003A70;
// --ic-brand-primary-lightened-5: #0C4D89;
// --ic-brand-primary-lightened-10: #19568F;
// --ic-brand-primary-lightened-15: #266095;
// --ic-brand-button--primary-bgd-darkened-5: #00417D;
// --ic-brand-button--primary-bgd-darkened-15: #003A70;
// --ic-brand-button--secondary-bgd-darkened-5: #2B3942;
// --ic-brand-button--secondary-bgd-darkened-15: #27333B;
// --ic-brand-font-color-dark-lightened-15: #4C5860;
// --ic-brand-font-color-dark-lightened-30: #6C757C;
// --ic-link-color-darkened-10: #0080CC;
// --ic-link-color-lightened-10: #1999E4;
// --ic-brand-primary: #004483;
// --ic-brand-font-color-dark: #2D3B45;
// --ic-link-color: #008EE2;
// --ic-brand-button--primary-bgd: var(--ic-brand-primary);
// --ic-brand-button--primary-text: #ffffff;
// --ic-brand-button--secondary-bgd: #2D3B45;
// --ic-brand-button--secondary-text: #ffffff;


// --ic-brand-global-nav-bgd: #004483;
// --ic-brand-global-nav-ic-icon-svg-fill: #ffffff;
// --ic-brand-global-nav-ic-icon-svg-fill--active: var(--ic-brand-primary);
// --ic-brand-global-nav-menu-item__text-color: #ffffff;
// --ic-brand-global-nav-menu-item__text-color--active: #004483;
// --ic-brand-global-nav-avatar-border: #ffffff;
// --ic-brand-global-nav-menu-item__badge-bgd: #f00066;
// --ic-brand-global-nav-menu-item__badge-text: #ffffff;
// --ic-brand-global-nav-logo-bgd: #004483;
// --ic-brand-header-image: url(https://learning.hanyang.ac.kr/accounts/1/files/87/download?verifier=Lx37FohA0FYJL6tidK0sgQKJHatM48QjqYWF01uO);
// --ic-brand-mobile-global-nav-logo: url(https://learning.hanyang.ac.kr/accounts/1/files/292/download?verifier=o6vRmdVGQAsbZO9Zc4U1b3z1xNb9do899JDUZE9a);