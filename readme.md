# Contracts4Components

> <span style="color:red;font-weight:bold;">NOTE:</span> This project is a proof of concept and provides an example of how one could do something like this.
> It is not complete, does not handle other cases than the ones shown in the example and I'm currently not planning to extend it

This example supports only dom and react test framework at the moment.

The idea is to bring contract tests to the frontend world.

You can read more about it in [my blog](https://matthias-kainer.de/blog/posts/contract-testing-in-the-frontend)

## Getting started

Clone this repo and run `./go setup`

To start the server and run a suite of consumer and provider tests to populate the database, run `./go run`.

The tests can be found in [contracts4components.web/test](contracts4components.web/test).

## The server

The server is available as a docker container, and can be started via

```sh
docker run -d -p 8097:8097 --name=contracts4components mkainer/contracts4components.server
```

Note that `./go run` will do this for you automatically.

This will expose it on port 8097, check it out via [http://localhost:8097/contracts](http://localhost:8097/contracts).

For more infos, look into the [Server Readme](contracts4components.server/README.md).