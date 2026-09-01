export {}

const getVarsBtn = document.getElementById('getVars')
const desk = document.getElementById('deskForVars')
const copyVarsBtn = document.getElementById('copyVars')
const textError = document.querySelector('.error_getting')
const clearVarsBtn = document.getElementById('clearVars')

const getVarsFromSelection = () => {
    parent.postMessage({
        pluginMessage:
        {
            type: 'getVariables'
        }
    }, '*')
}

getVarsBtn.addEventListener('click', getVarsFromSelection)

// navigator.clipboard is blocked in Figma's plugin iframe, execCommand still works there
copyVarsBtn.addEventListener('click', () => {
    const el = document.createElement('textarea')
    el.value = desk.textContent
    el.setAttribute('readonly', '')
    el.setAttribute('style', 'position: absolute; left: -9999px')
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copyVarsBtn.textContent = 'Copied!'
    setTimeout(() => {
        copyVarsBtn.textContent = 'COPY'
    }, 1000)
});

const showError = (message: string) => {
    textError.textContent = message
    setTimeout(() => textError.textContent = '', 1500)
}

window.addEventListener('message', (e) => {
    const msg = e.data.pluginMessage
    if (!msg) {
        return
    }
    if (msg.status === 'selectionEmpty') {
        showError('Select shapes on canvas')
    } else if (msg.status === 'selectionPartiallyWrong') {
        showError('Selection has incorrect items')
    } else if (msg.status === 'selectionFilled') {
        let varsString = ''
        msg.data.forEach(el => {
            const r = Math.round(el[1].r * 255)
            const g = Math.round(el[1].g * 255)
            const b = Math.round(el[1].b * 255)
            const alpha = Number(el[2].toFixed(2))
            varsString += `${el[0]}: rgba(${r}, ${g}, ${b}, ${alpha});\n`
        });
        desk.textContent = varsString
        copyVarsBtn.setAttribute('style', 'display:block')
    }
})

clearVarsBtn.addEventListener('click', ()=> {
    desk.textContent = ''
    copyVarsBtn.setAttribute('style', 'display:none')
})
