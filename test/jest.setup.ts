import '@testing-library/jest-dom'
import dotenvFlow from 'dotenv-flow'

dotenvFlow.config({ silent: true })
jest.mock('../config/firebase')
