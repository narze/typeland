import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth as firebaseAuth } from '../config/firebase'
import { useAuth } from '@/contexts/Auth'
import { useRouter } from 'next/router'

import { Field, Input, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState, useEffect, type JSX } from 'react'

const s = {
  container: 'h-screen min-w-full flex items-center justify-center',
  main: 'max-w-[50%] min-w-[640px]',
  header: 'fixed top-0 right-8 pt-4 text-right',
  title: 'text-4xl text-blue-600 antialiased',
}

export const Login = (): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()
  const [auth] = useAuth()
  const [signupForm, setSignupForm] = useState(false)
  const router = useRouter()

  const signUp = ({ email, password }) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
      .catch((e) => {
        alert(e.message)
      })
  }

  const login = ({ email, password }) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
      .catch((e) => {
        alert(e.message)
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

  useEffect(() => {
    if (auth.user) {
      router.push('/')
    }
  }, [auth])

  if (signupForm) {
    return (
      <div className={s.container}>
        <div className={s.header}>
          <button className="ml-4 cursor-pointer" onClick={() => router.back()}>
            Back
          </button>
        </div>

        <main className={s.main}>
          <h1 className={s.title}>Sign Up</h1>

          <form onSubmit={handleSubmit(signUp)}>
            <Field.Root invalid={!!errors.email}>
              <Field.Label htmlFor="email">Email</Field.Label>
              <Input
                id="email"
                {...register('email', { validate: validateEmail })}
              />
              <Field.ErrorText>
                {errors.email && (errors.email.message as string)}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label htmlFor="password">Password</Field.Label>
              <Input
                id="password"
                type="password"
                {...register('password', { validate: validatePassword })}
              />
              <Field.ErrorText>
                {errors.password && (errors.password.message as string)}
              </Field.ErrorText>
            </Field.Root>

            <div className="mt-4">
              <Button colorPalette="teal" loading={isSubmitting} type="submit">
                Submit
              </Button>

              <Button
                variant="ghost"
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
    <div className={s.container}>
      <div className={s.header}>
        <button className="ml-4 cursor-pointer" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <main className={s.main}>
        <h1 className={s.title}>Login</h1>

        <form onSubmit={handleSubmit(login)}>
          <Field.Root invalid={!!errors.email}>
            <Field.Label htmlFor="email">Email</Field.Label>
            <Input
              id="email"
              {...register('email', { validate: validateEmail })}
            />
            <Field.ErrorText>
              {errors.email && (errors.email.message as string)}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label htmlFor="password">Password</Field.Label>
            <Input
              id="password"
              type="password"
              {...register('password', { validate: validatePassword })}
            />
            <Field.ErrorText>
              {errors.password && (errors.password.message as string)}
            </Field.ErrorText>
          </Field.Root>

          <div className="mt-4">
            <Button colorPalette="teal" loading={isSubmitting} type="submit">
              Login
            </Button>

            <Button variant="ghost" ml={4} onClick={() => setSignupForm(true)}>
              Sign Up
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Login
