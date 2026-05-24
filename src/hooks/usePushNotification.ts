export function usePushNotification() {
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in globalThis)) return false
    if (!('serviceWorker' in navigator)) return false
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const subscribe = async (): Promise<PushSubscription | null> => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()
      if (existing) return existing

      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''
      if (!vapidKey) return null

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      })
      return subscription
    } catch {
      return null
    }
  }

  const showLocalNotification = (title: string, body: string, icon?: string) => {
    if (Notification.permission !== 'granted') return
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: icon ?? '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'barbershop-notification',
      })
    })
  }

  return { requestPermission, subscribe, showLocalNotification }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replaceAll('-', '+').replaceAll('_', '/')
  const rawData = globalThis.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.codePointAt(i) ?? 0
  }
  return output
}
