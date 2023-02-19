# Finite State Machine in React Showcase

## Getting Started

Run MongoDb database (you need to have Docker installed):

```sh
docker-compose up -d
```

Install dependencies:

```sh
npm install
```

Run frontend & backend:

```sh
npm run dev
```

## Known problems

- Bundle is pretty large and requires trimming. Mainly caused by monorepository structure. Will focus on it on later iterations.
- No tests, sorry.
- Styles require work. I would still prefer using MUI or Tailwind just to save time.
- Email is not validated and can be left empty.
- Browser's back and forward buttons don't work properly.
- Subscriptions are not saved on the backend.
