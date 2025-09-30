import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

/**
 * Request permissions for push notifications
 * @returns {Promise<boolean>} - Returns true if permission granted
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FBBA25',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      alert('Falha ao obter permissão para notificações push!')
      return
    }

    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('É necessário um dispositivo físico para notificações push')
  }

  return token
}

/**
 * Schedule a local notification for visit reminder
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Date} scheduledDate - When to trigger the notification
 * @returns {Promise<string>} - Notification identifier
 */
export async function scheduleVisitNotification(
  title: string,
  body: string,
  scheduledDate: Date
): Promise<string> {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: '#FBBA25',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledDate,
    },
  })

  return identifier
}

/**
 * Schedule a notification reminder before a visit
 * @param {string} apiaryName - Name of the apiary
 * @param {Date} visitDate - Date of the visit
 * @param {number} hoursBeforeVisit - Hours before visit to send notification (default: 24)
 * @returns {Promise<string>} - Notification identifier
 */
export async function scheduleVisitReminder(
  apiaryName: string,
  visitDate: Date,
  hoursBeforeVisit: number = 24
): Promise<string> {
  const reminderDate = new Date(
    visitDate.getTime() - hoursBeforeVisit * 60 * 60 * 1000
  )

  // Only schedule if the reminder date is in the future
  if (reminderDate.getTime() <= Date.now()) {
    throw new Error('A data do lembrete deve ser no futuro')
  }

  return await scheduleVisitNotification(
    '🐝 Lembrete de Visita ao Apiário',
    `Você tem uma visita agendada para o ${apiaryName} em ${hoursBeforeVisit} horas.`,
    reminderDate
  )
}

/**
 * Send an immediate notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
export async function sendImmediateNotification(
  title: string,
  body: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: '#FBBA25',
    },
    trigger: null,
  })
}

/**
 * Cancel a scheduled notification
 * @param {string} notificationId - Identifier of the notification to cancel
 */
export async function cancelScheduledNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Get all scheduled notifications
 * @returns {Promise<Notifications.NotificationRequest[]>}
 */
export async function getAllScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  return await Notifications.getAllScheduledNotificationsAsync()
}

/**
 * Dismiss all notifications from the notification tray
 */
export async function dismissAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync()
}
