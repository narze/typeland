# Typeland

A typing practice website, now in development -> https://typeland.vercel.app

![Imgur](https://i.imgur.com/EWAc8lD.png)

## Plan & Progress

https://github.com/narze/typeland/projects/1

## Contribution

Pull requests & ideas are welcome!

The code is written in JavaScript & TypeScript based on Next.js using [narze/thank-u-nextjs](https://github.com/narze/thank-u-nextjs) as a boilerplate.

## Setup

Setup [Firebase Auth](https://firebase.google.com/docs/auth) to persist users

1. Go to https://console.firebase.google.com and create a new project, then add a Web App (Ref: https://firebase.google.com/docs/web/setup)
2. Make a git-ignored copy of `.env`

```shell
cp .env .env.local
```

3. Edit `.env.local` then replace `NEXT_PUBLIC_FIREBASE_*` environment variables your credentials from step 1

## Running Locally

```shell
yarn install
yarn dev
```

## Alternatives & Inspirations

- [10FastFingers](https://10fastfingers.com)
- [Keybr](https://keybr.com)
- [Monkey Type](https://monkey-type.com)
- [Type Fu](http://type-fu.com)
- [TypeRacer](https://typeracer.com)
- [Typings](https://typings.gg)
