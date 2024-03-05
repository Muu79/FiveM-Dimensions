// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative

// Basic no operation function
export const noop = () => {}

export function hasKey<O extends Object>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj
  }