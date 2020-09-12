jest.mock('../config/firebase')

import { auth } from '../config/firebase'

export function mockFirebaseAuth(): void {
  const mockOnAuthStateChanged = auth.onAuthStateChanged as jest.Mock

  beforeEach(() => {
    mockOnAuthStateChanged
      .mockImplementation((callback) => callback({ email: 'foo@bar.com' }))
      .mockReturnValue(() => {
        return 'Unsubscribed'
      })
  })

  afterEach(() => {
    mockOnAuthStateChanged.mockClear()
  })
}
