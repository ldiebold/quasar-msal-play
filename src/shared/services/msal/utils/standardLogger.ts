import { LogLevel } from '@azure/msal-common'

export default function standardLogger (level: LogLevel, message: string, containsPii: boolean) {
  if (containsPii) {
    return
  }
  switch (level) {
    case LogLevel.Error:
      console.error(message)
      return
    case LogLevel.Info:
      console.info(message)
      return
    case LogLevel.Verbose:
      console.debug(message)
      return
    case LogLevel.Warning:
      console.warn(message)
  }
}
