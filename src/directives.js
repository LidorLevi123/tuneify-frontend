import { svgService } from './services/svg.service.js'

const icon = {
  mounted: (el, binding) => {
    const icon = svgService.getSvg(binding.value)
    el.innerHTML = icon
  },
  updated: (el, binding) => {
    const icon = svgService.getSvg(binding.value)
    el.innerHTML = icon
  },
}

const clickOutside = {
  mounted(el, { value: cb }) {
    el.clickOutside = (ev) => {
      if (!el.contains(ev.target)) {
        cb()
      }
    }
    setTimeout(() => {
      document.addEventListener('click', el.clickOutside)
    }, 0)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutside)
  },
}

export { clickOutside, icon }
