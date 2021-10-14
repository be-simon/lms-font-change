const textarea = document.getElementById('textarea')
const submitBtn = document.getElementById('submit_btn')

submitBtn.onclick = () => {
    chrome.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            const req = {
                "message": "send web font text",
                "content": textarea.value
            }
            chrome.tabs.sendMessage(tabs[0].id, req)
        })
}




// @font-face {
//     font-family: 'MapoFlowerIsland';
//     src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/MapoFlowerIslandA.woff') format('woff');
//     font-weight: normal;
//     font-style: normal;
// }