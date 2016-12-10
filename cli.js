#!/usr/bin/env node

/*!
 * charlike-cli <https://github.com/tunnckoCore/charlike-cli>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

const charlike = require('charlike')
const username = require('git-user-name')
const cli = require('meow')(`
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
`, {
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

const name = cli.input[0] || cli.flags.name
const desc = cli.input[1] || cli.flags.desc

if (cli.flags.help || !name || !desc) {
  cli.showHelp(0)
}

cli.flags.description = cli.flags.desc
cli.flags.repository = cli.flags.repo
cli.flags.owner = cli.flags.owner || username()

charlike(name, desc, cli.flags)
  .then((dest) => {
    console.log(`Project "${name}" scaffolded to "${dest}"`)
  })
  .catch((err) => {
    console.error(`Sorry, some error occured!`)
    console.error(`ERROR: ${err.message}`)
  })
