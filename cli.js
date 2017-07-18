#!/usr/bin/env node

/*!
 * charlike-cli <https://github.com/tunnckoCore/charlike-cli>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const updateNotifier = require('update-notifier')
const pkg = require('./package.json')
const charlike = require('charlike')
const username = require('git-user-name')
const cli = require('minimist')(process.argv.slice(2), {
  alias: {
    owner: 'O',
    name: 'N',
    desc: 'D',
    repo: 'R',
    engine: 'E',
    locals: 'L',
    templates: 'T',
    help: 'h',
    version: 'v'
  }
})

updateNotifier({ pkg: pkg }).notify()

process.title = pkg.bin ? Object.keys(pkg.bin)[0] : pkg.name

const name = cli._[0] || cli.name
const desc = cli._[1] || cli.desc

delete cli['_']

const showHelp = (status) => {
  console.log(`
  ${pkg.description}
  (${pkg.name} v${pkg.version})

  Usage
    $ charlike <name> <description> [flags]

  Common Flags
    --help            Show this output
    --version         Show version

  Options
    --owner, -O       Project github owner - username or organization
    --name, -N        Name of the project, same as to pass first param
    --desc, -D        Project description, same as to pass second param
    --repo, -R        Repository pattern like username/projectName
    --engine, -E      Engine to be used, j140 by default
    --locals, -L      Context to pass to template files (support dot notation)
    --templates, -T   Path to templates folder
    --cwd, -C         Folder to be used as current working dir

  Examples
    $ charlike my-awesome-project 'some cool description'
    $ charlike minibase-data 'we are awesome' --owner node-minibase
    $ charlike -D 'abc description here' -N beta-trans -O gulpjs

  Issues: https://github.com/tunnckoCore/charlike
  `)
  process.exit(status) // eslint-disable-line no-process-exit
}

if (cli.version) {
  console.log(`${pkg.name} v${pkg.version}`)
  process.exit(0) // eslint-disable-line no-process-exit
}
if (cli.help) {
  showHelp(0)
}
if (!name || !desc) {
  showHelp(1)
}

cli.description = desc
cli.repository = cli.repo
cli.owner = cli.owner || username()

const options = cli
options.locals = cli

charlike(name, desc, options)
  .then((dest) => {
    console.log(`Project "${name}" scaffolded to "${dest}"`)
  })
  .catch((err) => {
    console.error(`Sorry, some error occured!`)
    console.error(`ERROR: ${err.message}`)
    process.exit(1) // eslint-disable-line no-process-exit
  })
