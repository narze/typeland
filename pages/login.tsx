/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'
import { auth } from '../config/firebase'

import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/core'
import { useForm } from 'react-hook-form'

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

  function onSubmit(values) {
    return signUp(values).then((user) => {
      // eslint-disable-next-line no-console
      console.log(user)
    })
  }

  const signUp = ({ email, password }) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
      .catch((error) => {
        return { error }
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

  return (
    <div css={s.container}>
      <main css={s.main}>
        <h1 css={s.title}>Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button
            mt={4}
            variantColor="teal"
            isLoading={formState.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </main>
    </div>
  )
}

export default Login
