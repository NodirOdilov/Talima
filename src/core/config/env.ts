// Конфигурация окружения фронтенда
const rawVersion = import.meta.env.VITE_APP_VERSION ?? '2.0.0'
const versionParts = rawVersion.split('.')

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1'),
  appName: 'Talima Enterprise',
  version: rawVersion,
  versionShort: versionParts.length >= 2 ? `${versionParts[0]}.${versionParts[1]}` : rawVersion,
} as const
