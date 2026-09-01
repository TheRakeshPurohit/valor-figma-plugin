import './style/ui.scss'
import './ui/uiDrawColors'
import './ui/uiGetVariables'

declare const APP_VERSION: string

document.getElementById('appVersion').textContent = `v${APP_VERSION}`

const modeV2C = document.getElementById('checkboxV2C') as HTMLInputElement
const modeC2V = document.getElementById('checkboxC2V') as HTMLInputElement

const tabV2C = document.querySelector('.header_showV2C')
const tabC2V = document.querySelector('.header_showC2V')

const layoutV2C = document.querySelector('.layout_V2C')
const layoutC2V = document.querySelector('.layout_C2V')

const showV2C = (visible: boolean) => {
  tabV2C.classList.toggle('tabs_active', visible)
  tabC2V.classList.toggle('tabs_active', !visible)
  layoutV2C.classList.toggle('layout_is-visible', visible)
  layoutC2V.classList.toggle('layout_is-visible', !visible)
}

modeV2C.addEventListener('change', () => showV2C(true))
modeC2V.addEventListener('change', () => showV2C(false))
