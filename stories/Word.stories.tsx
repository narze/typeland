import type { Meta, StoryObj } from '@storybook/nextjs'

import { Word } from '../components/Word'

const meta: Meta<typeof Word> = {
  title: 'Typeland/Word',
  component: Word,
}

export default meta

type Story = StoryObj<typeof Word>

export const Default: Story = {
  args: {
    template: 'Typeland',
    userInput: 'Typeland',
    showCaret: true,
  },
}

export const WrongWord: Story = {
  args: {
    template: 'Typeland',
    userInput: 'Typoland',
    showCaret: true,
  },
}

export const WordInputShorterThanTemplate: Story = {
  args: {
    template: 'dogeee',
    userInput: 'dog',
    showCaret: true,
  },
}

export const WordInputLongerThanTemplate: Story = {
  args: {
    template: 'dog',
    userInput: 'dogeee',
    showCaret: true,
  },
}
