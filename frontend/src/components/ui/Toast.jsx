// Minimal showToast util — appends temporary DOM node for simple toasts
export function showToast(message = '', type = 'info', timeout = 3000) {
  try {
    const containerId = 'gv-toast-container'
    let container = document.getElementById(containerId)
    if (!container) {
      container = document.createElement('div')
      container.id = containerId
      container.style.position = 'fixed'
      container.style.right = '16px'
      container.style.top = '16px'
      container.style.zIndex = '9999'
      document.body.appendChild(container)
    }

    const el = document.createElement('div')
    el.textContent = message
    el.style.marginTop = '8px'
    el.style.padding = '10px 14px'
    el.style.borderRadius = '6px'
    el.style.color = '#fff'
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'
    el.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif'

    switch (type) {
      case 'success':
        el.style.background = '#16a34a'
        break
      case 'error':
        el.style.background = '#dc2626'
        break
      case 'warning':
        el.style.background = '#f59e0b'
        break
      default:
        el.style.background = '#334155'
    }

    container.appendChild(el)
    setTimeout(() => {
      el.style.opacity = '0'
      el.style.transition = 'opacity 250ms'
      setTimeout(() => el.remove(), 300)
    }, timeout)
  } catch (err) {
    // silent
    // console.error('toast error', err)
  }
}

export default function Toast() {
  return null
}
