import { onAuthStateChanged } from 'firebase/auth'

export function mockFirebaseAuth(): void {
  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock

  beforeEach(() => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ email: 'foo@bar.com' })
      return () => 'Unsubscribed'
    })
  })

  afterEach(() => {
    mockOnAuthStateChanged.mockClear()
  })
}
