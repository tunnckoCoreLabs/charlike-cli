#!/usr/bin/env node

'use strict';

const proc = require('process');
const getPkg = require('@tunnckocore/package-json').default;
const charlike = require('charlike');

const cli = require('mri')(process.argv.slice(2), {
  alias: {
    owner: 'O',
    name: 'N',
    desc: 'D',
    repo: 'R',
    engine: 'E',
    locals: 'L',
    templates: 'T',
    help: 'h',
    version: 'v',
  },
});

proc.title = 'charlike-cli';
const name = cli._[0] || cli.name;
const desc = cli._[1] || cli.desc;

delete cli._;

function get(pkgName, field = 'version') {
  return getPkg(pkgName).then((pkg) => pkg[field]);
}

async function showHelp(status = 0) {
  console.log(`
  ${await get('charlike-cli', 'description')}
  (charlike-cli v${await get('charlike-cli')})
  (charlike v${await get('charlike')})

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

  Issues 1: ${await get('charlike', 'homepage')}
  Issues 2: ${await get('charlike-cli', 'homepage')}
  `);

  if (status !== 1) {
    throw new Error('foo');
  }

  proc.exit(status);
}

if (cli.help) {
  showHelp();
}

if (!name || !desc) {
  showHelp(1).catch(() => proc.exit(1));
} else {
  cli.description = desc;

  /* eslint-disable promise/always-return */

  charlike(name, desc, cli)
    .then((dest) => {
      console.log(`Project "${name}" scaffolded to "${dest}"`);
    })
    .catch((err) => {
      /* istanbul ignore next */
      console.error(`Sorry, some error occured!`);
      /* istanbul ignore next */
      console.error(`ERROR: ${err.message}`);
      /* istanbul ignore next */
      proc.exit(1);
    });
}
