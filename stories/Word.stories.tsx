import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Word, WordProps } from '../components/Word'

export default {
  title: 'Typeland/Word',
  component: Word,
} as Meta

const Template: Story<WordProps> = (args) => <Word {...args} />

export const Default = Template.bind({})

Default.args = {
  template: 'Typeland',
  userInput: 'Typeland',
  showCaret: true,
}

export const WrongWord = Template.bind({})

WrongWord.args = {
  template: 'Typeland',
  userInput: 'Typoland',
  showCaret: true,
}

export const WordInputShorterThanTemplate = Template.bind({})

WordInputShorterThanTemplate.args = {
  template: 'dogeee',
  userInput: 'dog',
  showCaret: true,
}

export const WordInputLongerThanTemplate = Template.bind({})

WordInputLongerThanTemplate.args = {
  template: 'dog',
  userInput: 'dogeee',
  showCaret: true,
}
