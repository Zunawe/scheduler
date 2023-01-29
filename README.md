# Scheduler

A tool for polling small numbers of people for scheduling events. The planner suggests dates, and anyone with a link to that page can select which of those dates they're available. This was made so my friends and I could more easily schedule our next D&D session.

You can try it out here: https://zunawe.io/scheduler

This project was made using [this](https://github.com/Zunawe/web-boilerplate) template.

## How to Run

### Docker

Nothing unusual, this will set up a volume, start a redis container, and start a container for this web app.

```sh
$ docker compose up -d
```

### Local/Not Dockerized

Make sure to create a `.env` file. Use `example.env` as reference. You must also have a [Redis](https://redis.io/) instance running.

```sh
$ npm i
$ npm run dev
```

Or, in production

```sh
$ npm ci
$ npm run build
$ npm start
```
