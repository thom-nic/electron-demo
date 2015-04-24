"use strict";

/* eslint-env mocha, browser, node, es6, jquery */

import phantom from 'phantom'
import {expect} from 'chai'

const BASE_URL = `file:${process.cwd()}/dist/index.html`
const PAGE_TITLE = 'Electron Demo'

describe('functional tests', () => {
  let driver = null,
      page = null

  before( (done) => {
    phantom.create( (ph) => {
      driver = ph
      driver.createPage( (_page) => {
        page = _page
        page.onError = (msg,trace) => {
          throw new Error(`Page error: ${msg}`)
        }
        done()
      })
    })
  })

  after( (done) => {
    driver.exit()
    done()
  })

  it('should load the page', (done) => {
    page.open(BASE_URL, (status) => {
      expect(status).to.equal('success')
      page.evaluate( () => { return document.title },
        (title) => {
          expect(title).to.equal(PAGE_TITLE)
          done()
        }
      )
    })
  })

  it('should have some content', (done) => {
    page.open(BASE_URL, (status) => {
      expect(status).to.equal('success')
      page.includeJs('http://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.4/zepto.min.js', () => {
        page.evaluate(() => {
          return $('#content')
        },
        (list) => {
          expect(list).to.not.be.empty
          done()
        })
      })
    })
  })
})
