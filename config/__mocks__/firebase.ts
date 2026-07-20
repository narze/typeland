// Manual mock for `config/firebase`. The real module initializes the Firebase
// app and exports handles (`auth`, `db`, ...). In tests these are just opaque
// objects handed to the (separately mocked) modular SDK functions.
export const firebaseConfig = {}
export const app = { name: '[DEFAULT]' }
export const auth = {}
export const db = {}
export const now = 0
export const storage = {}
