import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { TypingArea, TypingAreaProps } from '../components/TypingArea'

export default {
  title: 'Typeland/TypingArea',
  component: TypingArea,
} as Meta

const Template: Story<TypingAreaProps> = (args) => <TypingArea {...args} />

export const Default = Template.bind({})

Default.args = {
  words: ['Hello', 'World!'],
  userWords: ['Hello', 'W'],
  showCaret: true,
}

export const WrongTyping = Template.bind({})

WrongTyping.args = {
  words: ['Hello', 'World!'],
  userWords: ['Jello', 'War!'],
  showCaret: true,
}
