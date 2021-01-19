This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Local Development
First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see 
the result.

### Dockerized
Note that the docker container used here directly runs the production build of
next.js. Running this in production is ill-advised as it will not scale.

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see 
the result.
