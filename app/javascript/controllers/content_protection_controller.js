import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    document.addEventListener("copy", this.preventClipboard)
    document.addEventListener("cut", this.preventClipboard)
    document.addEventListener("contextmenu", this.preventContextMenu)
    document.addEventListener("keydown", this.preventKeyboardShortcuts)
  }

  disconnect() {
    document.removeEventListener("copy", this.preventClipboard)
    document.removeEventListener("cut", this.preventClipboard)
    document.removeEventListener("contextmenu", this.preventContextMenu)
    document.removeEventListener("keydown", this.preventKeyboardShortcuts)
  }

  preventClipboard(event) {
    event.preventDefault()
  }

  preventContextMenu(event) {
    event.preventDefault()
  }

  preventKeyboardShortcuts(event) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
    const modifier = isMac ? event.metaKey : event.ctrlKey

    const blockedKeys = ["c", "C", "u", "U", "s", "S", "p", "P", "a", "A"]

    if (modifier && blockedKeys.includes(event.key)) {
      event.preventDefault()
    }

    if (event.key === "F12") {
      event.preventDefault()
    }

    if (modifier && event.shiftKey && (event.key === "I" || event.key === "i" || event.key === "J" || event.key === "j" || event.key === "C" || event.key === "c")) {
      event.preventDefault()
    }
  }
}
