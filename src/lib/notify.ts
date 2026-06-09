'use client'

export function requestNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function sendBrowserNotification(title: string, body: string, onClick?: () => void) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  const n = new Notification(title, { body, icon: '/icons/icon-192.png' })
  if (onClick) n.onclick = () => { window.focus(); onClick() }
}

export function playSound(src: string) {
  try {
    const audio = new Audio(src)
    audio.volume = 0.5
    audio.play().catch(() => {})
  } catch {}
}

