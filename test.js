/*!
 * charlike-cli <https://github.com/tunnckoCore/charlike-cli>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

const exists = require('fs-exists-sync')
const execa = require('execa')
const test = require('mukla')

test('should show help when no flags with exit code 1', function (done) {
  const promise = execa.stdout('node', ['./cli.js'])

  promise.catch((err) => {
    test.strictEqual(err.code, 1)
    test.strictEqual(/Common Flags/.test(err.message), true)
    done()
  })
})

test('should output version when --version flag', (done) => {
  const promise = execa.stdout('node', ['./cli.js', '--version'])
  promise.then((output) => {
    test.strictEqual(/charlike-cli v/.test(output), true)
    test.strictEqual(/charlike v/.test(output), true)
    done()
  }, done)
})

test('should scaffold project', (done) => {
  execa('node', ['./cli.js', 'foo-quxie', '"some descr"']).then(() => {
    test.strictEqual(exists('./foo-quxie'), true)
    test.strictEqual(exists('./foo-quxie/package.json'), true)
    done()
  }, done)
})

test('should show help with exit code 0', (done) => {
  execa.stdout('node', ['./cli.js', '--help']).then((output) => {
    test.strictEqual(/common flags/i.test(output), true)
    done()
  }, done)
})
