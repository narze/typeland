import type { Meta, StoryObj } from '@storybook/nextjs'

import { TypingArea } from '../components/TypingArea'
import { randomWords } from '../utils/wordsDb'
import { StatsProvider } from '../contexts/Stats'
import { AuthProvider } from '../contexts/Auth'

const meta: Meta<typeof TypingArea> = {
  title: 'Typeland/TypingArea',
  component: TypingArea,
  decorators: [
    (Story) => (
      <AuthProvider>
        <StatsProvider>
          <Story />
        </StatsProvider>
      </AuthProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof TypingArea>

export const Default: Story = {
  args: {
    words: ['Hello', 'World!'],
    userWords: ['Hello', 'W'],
    showCaret: true,
  },
}

export const WrongTyping: Story = {
  args: {
    words: ['Hello', 'World!'],
    userWords: ['Jello', 'War!'],
    showCaret: true,
  },
}

const manyWords = randomWords(100)

export const ManyWords: Story = {
  args: {
    words: manyWords,
    userWords: manyWords,
    showCaret: true,
  },
}
