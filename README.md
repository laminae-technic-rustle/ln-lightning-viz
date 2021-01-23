
# Introduction
Information about the way this is put together can be found in the respective 
readme files:

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)
- [Shared](shared/README.md)

For an overview of some thoughts / rants while building this, please look at
the [Logbook](logbook.md).

# Getting Started
## Local Development
Start off by making sure you have yarn configured to use workspaces. Read 
more about why this is in the [shared readme](shared/README.md).

```
yarn config set workspaces-experimental true
```

### BE
First, run the development server:

```bash
yarn dev
```
The server should be running at [http://localhost:8080](http://localhost:8080).

### FE
First, run the development server:

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see 
the result. Make sure the BE is running in a different tab.

## Dockerized
Note that the docker container used here directly runs the production build of
next.js. Running this in production is ill-advised as it will not scale.

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see 
the result.
