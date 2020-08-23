/** @jsx jsx */
import { jsx } from '@emotion/core'
import tw from '@tailwindcssinjs/macro'

const s = {
  container: tw`
    h-screen min-w-full
    flex
    items-center justify-center
  `,
  title: tw`
    text-4xl
    text-blue-600
  `,
  typingArea: tw`
    text-lg
    text-green-600
  `,
}

export const Home = (): JSX.Element => (
  <div css={s.container}>
    <main>
      <h1 css={s.title}>Typeland</h1>

      <p css={s.typingArea}>The quick brown fox jumps over the lazy dog</p>
    </main>
  </div>
)

export default Home
