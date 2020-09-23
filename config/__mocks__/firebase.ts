import firebasemock from 'firebase-mock'

const auth = new firebasemock.MockAuthentication()
export const mockdatabase = new firebasemock.MockFirebase()
const db = new firebasemock.MockFirestore()
export const mockstorage = new firebasemock.MockStorage()
export const mockmessaging = new firebasemock.MockMessaging()

export const mockFirebase = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  (path) => {
    return path ? mockdatabase.child(path) : mockdatabase
  },
  // use null if your code does not use AUTHENTICATION
  () => {
    return auth
  },
  // use null if your code does not use FIRESTORE
  () => {
    return db
  },
  // use null if your code does not use STORAGE
  () => {
    return mockstorage
  },
  // use null if your code does not use MESSAGING
  () => {
    return mockmessaging
  }
)

mockFirebase.initApp = jest.fn()

export { auth, db }

export default mockFirebase
