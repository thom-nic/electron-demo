"use strict";

/* eslint-env mocha, browser, node, es6, jquery */

//import {expect} from 'chai'
import Browser from 'zombie'

const PORT = 8888,
      PAGE_TITLE = 'Electron Demo'

Browser.localhost('localhost', PORT)

describe('User visits page', function() {

  const browser = new Browser()

  before(function(done) {
    browser.visit('/', done)
  })

  describe('base page', function() {
    it("should load the page", function() {
      browser.assert.success()
    })

    it("should have content", function() {
      browser.assert.text('title',PAGE_TITLE)
      browser.assert.element('github-repos table')
    })
  })

  describe('gets repos', function() {

    before(function(done) {
      browser
        .fill('gh_username','substack')
        .pressButton('Show Repos', done)
    })

    it('should be successful', function() {
      browser.assert.success()
    })

    it('should load repos for that user', function() {
      browser.assert.elements('github-repos table tbody tr')
    })
  })

})
