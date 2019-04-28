![Home Page](https://raw.githubusercontent.com/lenconda/openhooks/master/banner.png)

🔱 A simple server for webhooks.

[![Build Info](https://api.travis-ci.org/lenconda/openhooks.svg?branch=master)](https://github.com/lenconda/openhooks)
![npm](https://img.shields.io/npm/v/openhooks.svg)
![ndoe version](https://img.shields.io/node/v/openhooks.svg)
![monthly downloads](https://img.shields.io/npm/dt/openhooks.svg)
[![license](https://img.shields.io/npm/l/openhooks.svg)](https://github.com/lenconda/openhooks/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lenconda/openhooks/issues)

## Installation

OpenHooks is a command-line-based tool, available at [npm registry](https://www.npmjs.com).

Notice that a [Node.js](https://nodejs.org) environment is required. The latest version of Node.js is supposed to 8.12 or higher. After installation, set right system variables for Node.js, and there will be two command: `node` amd `npm`.

The OpenHook installation command with `npm` is:

```
$ npm install openhooks -g
```

If the privileges of current user is not permitted to install a Node.js module globally (usually as binary commands), add a `sudo` command before. e.g.

```
$ sudo npm install openhooks -g
```

or simply as root user:

```
# npm install openhooks -g
```

which is **NOT** recommended.

After finishing this command, the OpenHooks will be successfully installed on your system. This program provides three commands:

- `openhooks-router`
- `openhooks-key`
- `openhooks-server`

## Features

- RESTFul callbacks
- Daemonized backend server
- CRUD hooks routers without restarting server
- Port customization supported

## Quick Start

### Manage Webhooks

Use command `openhooks-router` to manage hooks.

The usage of this command is as below:

```
Usage: openhooks-router [options] [command]

Options:
  -V, --version             output the version number
  -h, --help                output usage information

Commands:
  generate                  generate route for a webhook
  list                      list all webhooks of the server
  delete <index>            delete a webhook with specified index
  update [options] <index>  update a webhook
  clear                     clear all webhooks
```

#### Generate a Webhook

```
$ openhooks-router generate
```

This action will start an interactive interface:

```
? Authentication requirement (false) true
? The command for this webhook (null) cd /workdir/app; git pull; docker-compose up -d --build;
? The description for this webhook (null) rebuild project
There are no keys, generated a new key: 72f4203069cb11e9a734e3dd813b8fd2
Generated a webhook: /hooks/96b2804a215247d383151f59f81ce5cf
```

> **NOTICE**: If there are no keys in OpenHooks configuration file, `openhooks-router generate` will generate an access key **automatically**

#### List Webhooks

```
$ openhooks-router list
```

It will print a table of current webhooks:

```
Total: 2
┌─────────┬───────────────────────────────────────────┬───────────────────┬────────────────────────────────────────────────────────────┬───────┬───────────────────────┬────────────┐
│ (index) │                   path                    │    description    │                          command                           │ auth  │      createTime       │ updateTime │
├─────────┼───────────────────────────────────────────┼───────────────────┼────────────────────────────────────────────────────────────┼───────┼───────────────────────┼────────────┤
│    0    │ '/hooks/96b2804a215247d383151f59f81ce5cf' │ 'rebuild project' │ 'cd /workdir/app; git pull; docker-compose up -d --build;' │ true  │ '2019-04-28 23:36:53' │    null    │
│    1    │ '/hooks/5c5069183e884380968e28784c18f66a' │    'ping test'    │                 'ping www.google.com -c 5'                 │ false │ '2019-04-28 23:38:22' │    null    │
└─────────┴───────────────────────────────────────────┴───────────────────┴────────────────────────────────────────────────────────────┴───────┴───────────────────────┴────────────┘
```

#### Update a Webhook

Use command `update` to update a specified webhook. The detailed usage of `update` is below:

```
Usage: update [options] <index>

update a webhook

Options:
  -a --auth [boolean]      change the authentication requirement of the webhook
  -c --new-command [cmd]   add command when the webhook is triggered
  -d --desc [description]  add description for the webhook
  -h, --help               output usage information
```

> **NOTICE**: to change the requirement of authentication, `-a` option must be specified, e.g. if the authentication of a webhook is supposed to be disabled, the command would be `openhooks-router update <index> -a false`.

#### Delete & Clear Webhooks

Use command `delete` to delete a webhook. The `index` option is required. `delete` command will remove the webhook with specified index from `list` output.

```
$ openhooks-router delete 0
```

Use command `clear` to remove all webhooks.

```
$ openhooks-router clear
```

then `list` will output an empty table:

```
Total: 0
┌─────────┐
│ (index) │
├─────────┤
└─────────┘
```

### Manage Keys

Use command `openhooks-key` to manage access keys.

The usage of this command is as below:

```
$ openhooks-key -h
Usage: openhooks-key [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      output usage information

Commands:
  generate        generate an access key
  list            list all keys of the server
  delete <index>  delete a key with specified index
  clear           clear all keys
```

#### List All Keys

```
$ openhooks-key list
```

```
Total: 1
┌─────────┬────────────────────────────────────┬───────────────────────┐
│ (index) │                key                 │      createTime       │
├─────────┼────────────────────────────────────┼───────────────────────┤
│    0    │ '72f4203069cb11e9a734e3dd813b8fd2' │ '2019-04-28 23:36:53' │
└─────────┴────────────────────────────────────┴───────────────────────┘
```

#### Generate a Key

```
$ openhooks-key generate
```

#### Delete a key

Use command `delete` to delete an access key. The `index` option is required. `delete` command will remove the access key with specified index from `list` output.

```
$ openhooks-key delete 0
```

#### Clear All Keys

```
$ openhooks-key clear
```

### Manage Server

Use command `openhooks-server`. The `-a, --action` parameter is required and `-p, --port` parameter is optional.

The `action` parameter is enumerable, contains `start|restart|stop`:

#### Start Server

```
$ openhooks-server start
```

The server will listen at `*:5000/tcp`.

Start the server with `port` parameter:

```
$ openhooks-server start 6000
```

The server will listen at `*:6000/tcp`

#### Stop Server

```
$ openhooks-server stop
```

#### Restart Server

```
$ openhooks-server restart
```

## Trigger a Webhook

A simple HTTP request will trigger a webhook. e.g. The webhook server is listening at `localhost:5000`, the path of the webhook supposed to be triggered is `/hooks/c66ee59c-7a27-47d7-948c-2a5f4d229134`, the following command will make it:

```
$ curl http://localhost:5000/hooks/b11216bc-bc90-4edd-82c3-b588ca7219f5
```

If it is an authentication-required webhook, the command will be:

```
$ curl -H "Access-Key:dda3fc50602c11e9a0833dcb0b0dbc38" http://localhost:5000/hooks/b11216bc-bc90-4edd-82c3-b588ca7219f5
```

## Tests

Clone this repository first:

```
$ git clone https://github.com/lenconda/openhooks.git
```

Be sure that the `NODE_ENV` path of system is not set to `production`, then install dependencies:

```
$ npm install
```

Run the test suit by following command:

```
$ npm run test
```

## Issues

This project still has many things to do since it is a new Node.js module. For any problems and advices, please open a issue at

[https://github.com/lenconda/openhooks/issues](https://github.com/lenconda/openhooks/issues)

## Contribution

Thanks for your interest in this project. You are welcomed to make contributions on it. However, before you starting your contribution work, please read the following advice:

- Read the [README](https://github.com/lenconda/openhooks#readme) first
- Understand what changes you want to make
- Look through the issue list and check if there's an issue to solve the same problem
- **Publish** or/and **redistribute** this project should under [MIT](LICENSE) license

### Issues

As said above, before you starting your work, you should check [issue list](https://github.com/lenconda/openhooks/issues) first. The issue list of this project can probably contains known bugs, problems, new demands and future development plans. If you can find an issue or many issues that solves the same problem, it would be great if you can join them to solve the problem.

### Fork & Pull Requests

If you decide to write your code in this project, you can fork this project as your own repository, check out to a new branch, from the newest code at `master` branch. The new branch would be your work bench.

If you want to commit your changes, you are supposed to make an [pull request](https://help.github.com/articles/about-pull-requests/), once you submit the request, the review process will start, if the code meets the requirements, the pull request will pass, and then your code will be in the project. If the request does not be passed, please contact [i@lenconda.top](mailto:i@lenconda.top) or [prexustech@gmail.com](mailto:prexustech@gmail.com).

## Author(s)

- lenconda <[i@lenconda.top](mailto:i@lenconda.top)> [[https://blog.lenconda.top](https://blog.lenconda.top)]

## TODOS

- [ ] Support JSON response customization
- [x] Better JSON reponse
- [x] Authorized webhooks
- [ ] Webhooks notifications
- [ ] Plugins support

## License

[MIT](LICENSE)
