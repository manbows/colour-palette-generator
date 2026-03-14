const colorInput = document.getElementById("colorCount")
const generateButton = document.getElementById("generateBtn")
const clearButton = document.getElementById("clearBtn")
const palette = document.getElementById("palette")
const countHeading = document.getElementById("countHeading")
const message = document.getElementById("message")
const copyFormat = document.getElementById("copyFormat")
let messageTimeout 

function generateColor(){
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i=0; i<6; i++){
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function updateColorCount(number) {
    countHeading.innerText = number + " colours on screen"
}

function copyColor(event){
    const hex = event.currentTarget.querySelector("span").innerText
    const format = document.getElementById("copyFormat").value
    const colorText = format === 'RGB' ? hexToRgb(hex) : hex

    navigator.clipboard.writeText(colorText)
        .then(() => {
            showMessage(colorText + " copied to clipboard.")
        })
        .catch(err => {
            showMessage("Copy failed: " + err)
        })
}


function createBoxes(number) {
    palette.innerHTML = ""
    for (let i = 0; i < number; i++) {
        const box = document.createElement("div")
        box.classList.add("color-box")

        const span = document.createElement("span")
        const newColor = generateColor()

        box.style.backgroundColor = newColor
        span.innerText = newColor

        box.dataset.locked = 'false'
        const lockBtn = document.createElement("button")
        lockBtn.innerText = '🔓'
        lockBtn.classList.add("lock-btn")

        lockBtn.addEventListener("click", toggleLock)

        box.appendChild(span)
        box.appendChild(lockBtn)
        palette.appendChild(box)

        box.addEventListener("click", copyColor)
    }
    updateColorCount(number)
}

function toggleLock(event) {
    event.stopPropagation()

    const box = event.currentTarget.parentElement
    const isLocked = box.dataset.locked === 'true'

    if (isLocked) {
        box.dataset.locked = 'false'
        box.classList.remove('locked')
        event.currentTarget.innerText = '🔓'
    } else {
        box.dataset.locked = 'true'
        box.classList.add('locked')
        event.currentTarget.innerText = '🔒'
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
}

function generatePalette(){
    let number = parseInt(colorInput.value)

    if (!number || number < 1){
        number = 5
    }
    if (number > 20){
        number = 20
        colorInput.value = 20
        showMessage("Maximum limit is 20 colours")
    } else {
        clearMessage()
    }

    const boxes = document.querySelectorAll(".color-box")

    if (boxes.length === 0){
        createBoxes(number)
    } else {
        boxes.forEach(box => {
            if (box.dataset.locked !== 'true') {
                const newColor = generateColor()
                box.style.backgroundColor = newColor
                box.querySelector("span").innerText = newColor
            }
        })

        if (number > boxes.length) {
            for (let i = boxes.length; i < number; i++) {
                const box = document.createElement("div")
                box.classList.add("color-box")

                const span = document.createElement("span")
                const newColor = generateColor()

                box.style.backgroundColor = newColor
                span.innerText = newColor

                box.dataset.locked = 'false'

                const lockBtn = document.createElement("button")

                lockBtn.innerText = '🔓'
                lockBtn.classList.add("lock-btn")

                lockBtn.addEventListener("click", toggleLock)

                box.appendChild(span)
                box.appendChild(lockBtn)
                palette.appendChild(box)

                box.addEventListener("click", copyColor)
            }
        }

        if (number < boxes.length) {
            const allBoxes = Array.from(document.querySelectorAll(".color-box"))
            for (let i = allBoxes.length - 1; i >= number; i--) {
                if (allBoxes[i].dataset.locked !== 'true') {
                    palette.removeChild(allBoxes[i])
                }
            }
        }

        updateColorCount(document.querySelectorAll(".color-box").length)
    }
}

function clearMessage() {
    message.innerText = ""
}

function showMessage(text) {
    clearTimeout(messageTimeout)
    message.innerText = text
    messageTimeout = setTimeout(() => {
        message.innerText = "";
    }, 2000);
}

function handleKeyPress(event){
    if (event.key === 'g' || event.key === 'G') {
        generatePalette()
    }
}

generateButton.addEventListener("click", generatePalette)
clearButton.addEventListener("click", clearMessage)
document.addEventListener("keydown", handleKeyPress)