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

