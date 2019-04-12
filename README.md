[![Home Page](https://raw.githubusercontent.com/lenconda/openhooks/master/banner.png)](https://github.com/lenconda/openhooks)

🔱 A simple server for webhooks.

[![Build Info](https://api.travis-ci.org/lenconda/openhooks.svg?branch=master)](https://github.com/lenconda/openhooks)
![npm](https://img.shields.io/npm/v/openhooks.svg)
[![license](https://img.shields.io/npm/l/openhooks.svg)](https://github.com/lenconda/openhooks/blob/master/LICENSE)

## Installation

OpenHooks is a command-line-based tool, available at [npm registry](https://www.npmjs.com).

Notice that a [Node.js](https://nodejs.org) environment is required. The latest version of Node.js is supposed to 8.12 or higher. After installation, set right system variables for Node.js, and there will be two command: `node` amd `npm`.

The OpenHook installation command with `npm` is:

```bash
$ npm install openhooks -g
```

If the privileges of current user is not permitted to install a Node.js module globally (usually as binary commands), add a `sudo` command before. e.g.

```bash
$ sudo npm install openhooks -g
```

or simply as root user:

```bash
# npm install openhooks -g
```

But it is NOT recommended.

After finishing this command, the OpenHooks will be successfully installed on your system. This program provides one command:

```
$ openhooks
```

## Features

- Daemonized backend server
- CRUD hooks routers without restarting server
- Port customization supported

## Quick Start

The program only provides one simple command to help users configure and start a webhook server.

The basic usage of this program is as below:

```
$ openhooks -h                                                                                               
Usage: openhooks [options] [command]

Options:
  -V, --version           output the version number
  -h, --help              output usage information

Commands:
  server <action> [port]  manage webhook server
  add [options]           add a webhook
  ls                      list all webhooks of the server
  del <index>             delete a webhook with specified index
  clear                   clear all webhooks
```

### Start a Server

Use command `server`. The `action` parameter is required and `port` parameter is optional.

The `action` parameter is enumerable, contains `start|stop|restart`:

Start the server:

```bash
$ openhooks server start
Listening at port 6000
Starting OpenHooks Server daemon...
OpenHooks Server daemon started. PID: XXXX
```

Start the server with `port` parameter:

```bash
$ openhooks server start 6000
Listening at port 6000
Starting OpenHooks Server daemon...
OpenHooks Server daemon started. PID: XXXX
```

Stop the server:

```bash
$ openhooks server stop
Stopping OpenHooks Server daemon...
OpenHooks Server daemon stopped.
```

Restart the server:

```bash
$ openhooks server restart
Stopping OpenHooks Server daemon...
OpenHooks Server daemon stopped.
Starting OpenHooks Server daemon...
OpenHooks Server daemon started. PID: XXXX
```

### Add a Webhook

Use command `add`. Usage of `openhooks add` is as below:

```
Usage: add [options]

add a webhook

Options:
  -d --desc <description>  add description for the webhook
  -c --command <cmd>       add command when the webhook is triggered
  -h, --help               output usage information
```

both `-d` and `-c` options are required, while `-d` option defines the webhook description and `-c` option defines the command to execute when the webhook is triggered. e.g. If add a webhook to execute `/path/to/exec.sh`, the command will be:

```bash
$ openhooks add -c "/path/to/exec.sh" -d "Execute a shell script"
```

`-c` option can also contains a system command like `curl`, `wget`, `git`, etc.

> **NOTICE**: The shell script in `-c` option should be a full path, and the shell script must have the execute right. For *nix systems, use `chmod +x /path/to/exec.sh` to add the execute right to a shell script. However, it is also okay if the script does not have the execute right by specifying the shell interpreter. e.g. `/bin/bash /path/to/exec.sh`.

### List All Webhooks

Use command `ls`. This command will output a table of all of the current webhooks.

```
$ openhooks ls
Total: 1
┌─────────┬───────────────────────────────────────────────┬──────────────────────────┬────────────────────┐
│ (index) │                     path                      │       description        │      command       │
├─────────┼───────────────────────────────────────────────┼──────────────────────────┼────────────────────┤
│    0    │ '/hooks/c66ee59c-7a27-47d7-948c-2a5f4d229134' │ 'Execute a shell script' │ '/path/to/exec.sh' │
└─────────┴───────────────────────────────────────────────┴──────────────────────────┴────────────────────┘
```

### Trigger a Webhook

A simple HTTP request will trigger a webhook. e.g. The webhook server is listening at `localhost:5000`, the path of the webhook supposed to be triggered is `/hooks/c66ee59c-7a27-47d7-948c-2a5f4d229134`, the following command will make it:

```bash
$ curl http://localhost:5000/hooks/c66ee59c-7a27-47d7-948c-2a5f4d229134
```

### Delete & Clear Webhook(s)

Use command `del` to delete a webhook. The `index` option is required. `del` command will remove the webhook with specified index from `ls` output.

```
$ openhooks del 0
Deleted /hooks/c66ee59c-7a27-47d7-948c-2a5f4d229134
```

Use command `clear` to remove all webhooks.

```
$ openhooks clear
Cleared all webhooks
```

then `ls` will output an empty table:

```
$ openhooks ls
Total: 0
┌─────────┐
│ (index) │
├─────────┤
└─────────┘
```

## Tests

Clone this repository first:

```bash
$ git clone https://github.com/lenconda/openhooks.git
```

Be sure that the `NODE_ENV` path of system is not set to `production`, then install dependencies:

```bash
$ npm install
```

Run the test suit by following command:

```bash
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
- [ ] Better JSON reponse
- [ ] Authorized webhooks

## License

[MIT](LICENSE)
