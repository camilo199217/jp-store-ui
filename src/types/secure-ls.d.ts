declare module 'secure-ls' {
  interface SecureLSOptions {
    encodingType?: 'AES' | 'DES' | 'RC4' | 'Rabbit' | 'Base64' | ''
    isCompression?: boolean
    encryptionSecret?: string
  }

  class SecureLS {
    constructor(options?: SecureLSOptions)
    get(key: string): string | null
    set(key: string, value: string): void
    remove(key: string): void
    clear(): void
    getAllKeys(): string[]
  }

  export default SecureLS
}
