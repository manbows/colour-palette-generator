const colorInput = document.getElementById("colorCount")
const generateButton = document.getElementById("generateBtn")
const clearButton = document.getElementById("clearBtn")
const palette = document.getElementById("palette")
const countHeading = document.getElementById("countHeading")
const message = document.getElementById("message")
const copyFormat = document.getElementById("copyFormat")
const gradientBtn = document.getElementById("gradientBtn")
const gradientPreview = document.getElementById("gradientPreview")
const gradientCode = document.getElementById("gradientCode")

let messageTimeout
let selectedGradientBoxes = []

function selectForGradient(event) {
    const box = event.currentTarget

    if (box.classList.contains("gradient-selected")) {
        box.classList.remove("gradient-selected")
        selectedGradientBoxes = selectedGradientBoxes.filter(item => item !== box)
        return
    }
    if (selectedGradientBoxes.length < 2) {
        box.classList.add("gradient-selected")
        selectedGradientBoxes.push(box)
    } else {
        selectedGradientBoxes[0].classList.remove("gradient-selected")
        selectedGradientBoxes.shift()
        box.classList.add("gradient-selected")
        selectedGradientBoxes.push(box)
    }
}

function generateColor() {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function updateColorCount(number) {
    countHeading.innerText = number + " colours on screen"
}

function copyColor(event) {
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
        box.addEventListener("dblclick", selectForGradient)
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

function generateGradient() {
    if (selectedGradientBoxes.length < 2) {
        showMessage("Double click two colours to generate a gradient")
        return
    }
    const color1 = selectedGradientBoxes[0].querySelector("span").innerText
    const color2 = selectedGradientBoxes[1].querySelector("span").innerText
    const gradient = `linear-gradient(to right, ${color1}, ${color2})`
    gradientPreview.style.background = gradient
    gradientPreview.style.display = "block"
    gradientCode.innerText = gradient
    gradientCode.style.display = "block"
}

function savePalette() {
    const boxes = document.querySelectorAll(".color-box")
    if (boxes.length === 0) {
        showMessage("Generate a palette first")
        return
    }

    const colors = Array.from(boxes).map(box => box.querySelector("span").innerText)
    const saved = JSON.parse(localStorage.getItem("savedPalettes") || "[]")
    saved.push({ colors, id: Date.now() })
    localStorage.setItem("savedPalettes", JSON.stringify(saved))
    renderSavedPalettes()
    showMessage("Palette saved!")
}

function deletePalette(id) {
    const saved = JSON.parse(localStorage.getItem("savedPalettes") || "[]")
    const updated = saved.filter(p => p.id !== id)
    localStorage.setItem("savedPalettes", JSON.stringify(updated))
    renderSavedPalettes()
}

function expandPalette(savedPalette) {
    const existing = document.querySelector(".palette-modal")
    if (existing) existing.remove()

    const format = document.getElementById("copyFormat").value

    const modal = document.createElement("div")
    modal.classList.add("palette-modal")

    const modalMessage = document.createElement("p")
    modalMessage.classList.add("modal-message")

    const inner = document.createElement("div")
    inner.classList.add("palette-modal-inner")

    savedPalette.colors.forEach(color => {
        const swatch = document.createElement("div")
        swatch.classList.add("palette-modal-swatch")
        swatch.style.backgroundColor = color

        const displayColor = format === 'RGB' ? hexToRgb(color) : color

        const code = document.createElement("span")
        code.innerText = displayColor
        code.classList.add("palette-modal-code")

        swatch.addEventListener("click", () => {
            navigator.clipboard.writeText(displayColor)
                .then(() => {
                    modalMessage.innerText = displayColor + " copied!"
                    setTimeout(() => modalMessage.innerText = "", 2000)
                })
                .catch(err => {
                    modalMessage.innerText = "Copy failed: " + err
                })
        })

        swatch.appendChild(code)
        inner.appendChild(swatch)
    })

    const closeBtn = document.createElement("button")
    closeBtn.innerText = "Close"
    closeBtn.classList.add("palette-modal-close")
    closeBtn.addEventListener("click", () => modal.remove())

    modal.appendChild(inner)
    modal.appendChild(modalMessage)
    modal.appendChild(closeBtn)
    document.body.appendChild(modal)

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove()
    })
}

function renderSavedPalettes() {
    const saved = JSON.parse(localStorage.getItem("savedPalettes") || "[]")
    const container = document.getElementById("savedPalettes")
    const section = document.getElementById("savedSection")

    if (saved.length === 0) {
        section.style.display = "none"
        return
    }

    section.style.display = "block"
    container.innerHTML = ""

    saved.forEach(savedPalette => {
        const card = document.createElement("div")
        card.classList.add("saved-card")

        const strips = document.createElement("div")
        strips.classList.add("saved-strips")

        savedPalette.colors.forEach(color => {
            const strip = document.createElement("div")
            strip.classList.add("saved-strip")
            strip.style.backgroundColor = color
            strip.title = color
            strips.appendChild(strip)
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.innerText = "Delete"
        deleteBtn.classList.add("delete-btn")
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            deletePalette(savedPalette.id)
        })

        card.appendChild(strips)
        card.appendChild(deleteBtn)
        card.addEventListener("click", () => expandPalette(savedPalette))
        container.appendChild(card)
    })
}

function generatePalette() {
    let number = parseInt(colorInput.value)

    if (!number || number < 1) {
        number = 5
    }
    if (number > 20) {
        number = 20
        colorInput.value = 20
        showMessage("Maximum limit is 20 colours")
    } else {
        clearMessage()
    }

    const boxes = document.querySelectorAll(".color-box")

    if (boxes.length === 0) {
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
                box.addEventListener("dblclick", selectForGradient)
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
        message.innerText = ""
    }, 2000)
}

function handleKeyPress(event) {
    if (event.key === 'g' || event.key === 'G') {
        generatePalette()
    }
}

generateButton.addEventListener("click", generatePalette)
clearButton.addEventListener("click", clearMessage)
document.addEventListener("keydown", handleKeyPress)
gradientBtn.addEventListener("click", generateGradient)
document.getElementById("saveBtn").addEventListener("click", savePalette)

renderSavedPalettes()