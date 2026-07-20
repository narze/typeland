import '@testing-library/jest-dom'
import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

// jsdom lacks a few browser APIs that Chakra UI v3 / Ark UI rely on.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  }

  window.scrollTo = window.scrollTo || (() => undefined)
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver
}

// jsdom under jest does not expose structuredClone, which Chakra UI v3 uses
// when building its style system.
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (value) =>
    value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

// Firebase v9+ is fully modular, so its functions are imported directly from
// the SDK entrypoints rather than off our `config/firebase` module. Mock those
// entrypoints so tests never touch the real SDK.
jest.mock('firebase/app')
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(() => () => undefined),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
}))
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve()),
  Timestamp: { now: jest.fn(() => 0) },
}))
jest.mock('firebase/storage', () => ({ getStorage: jest.fn() }))
jest.mock('../config/firebase')
