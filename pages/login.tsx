/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { auth as firebaseAuth } from '../config/firebase'
import { AuthContext } from '@/contexts/Auth'

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/core'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'

const s = {
  container: tw`
    h-screen min-w-full
    flex
    items-center justify-center
  `,
  main: [
    tw`
      max-w-1/2
    `,
    css`
      min-width: 640px;
    `,
  ],
  title: tw`
    text-4xl
    text-blue-600
    antialiased
  `,
}

export const Login = (): JSX.Element => {
  const { handleSubmit, errors, register, formState } = useForm()
  const { state, dispatch } = useContext(AuthContext)
  const { user } = state
  const [signupForm, setSignupForm] = useState(false)

  const signUp = ({ email, password }) => {
    return firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
  }

  const login = ({ email, password }) => {
    return firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
  }

  function validateEmail(value) {
    let error
    if (!value) {
      error = 'Email is required'
    }
    return error || true
  }

  function validatePassword(value) {
    let error
    if (!value) {
      error = 'Password is required'
    } else if (value.length < 8) {
      error = 'Password must be longer than 8 characters'
    }
    return error || true
  }

  if (user) {
    return (
      <div css={s.container}>
        <main css={s.main}>
          <h1 css={s.title}>Logged In</h1>

          <p>You are logged in as {user.email}</p>

          <Button
            mt={4}
            variantColor="teal"
            onClick={() => dispatch({ type: 'unsetUser' })}
          >
            Logout
          </Button>
        </main>
      </div>
    )
  }

  if (signupForm) {
    return (
      <div css={s.container}>
        <main css={s.main}>
          <h1 css={s.title}>Sign Up</h1>

          <form onSubmit={handleSubmit(signUp)}>
            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                ref={register({ validate: validateEmail })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                ref={register({ validate: validatePassword })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <div css={tw`mt-4`}>
              <Button
                variantColor="teal"
                isLoading={formState.isSubmitting}
                type="submit"
              >
                Submit
              </Button>

              <Button
                variant="link"
                ml={4}
                onClick={() => setSignupForm(false)}
              >
                Login
              </Button>
            </div>
          </form>
        </main>
      </div>
    )
  }

  return (
    <div css={s.container}>
      <main css={s.main}>
        <h1 css={s.title}>Login</h1>

        <form onSubmit={handleSubmit(login)}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              ref={register({ validate: validateEmail })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              ref={register({ validate: validatePassword })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <div css={tw`mt-4`}>
            <Button
              variantColor="teal"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              Login
            </Button>

            <Button variant="link" ml={4} onClick={() => setSignupForm(true)}>
              Sign Up
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Login
