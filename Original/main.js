const url = 'https://chatgptapp11.azurewebsites.net/api/ChatGPTForOriginal?code=m6-b10VA630K9UzhXrponZPPj04RWmZjGRaruBxq2zUFAzFumpJRZg=='

// 非同期処理を行うためにasync/awaitを使用
const asyncFunc = async (text) => {
    outputArea.innerText = '考え中...'

    const parameter = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "text": text
        })
    }

    await fetch(url, parameter)
        .then(response => response.text())
        .then(data => {
            outputArea.innerText = data
        });
}

const sendButton = document.getElementById('sendButton')
const inputText = document.getElementById('inputText')
const outputArea = document.getElementById('outputArea')

sendButton.addEventListener('click', () => {
    asyncFunc(inputText.value)
})
