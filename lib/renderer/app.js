"use strict";

import m from 'mithril'
import view from './view'

const API_BASE = 'https://api.github.com'
const DEFAULT_USER = 'thom-nic'

function getReposFor(user) {
  return m.request({
    method: "GET",
    url: `${API_BASE}/users/${user}/repos`
  })
}

function ViewModel(name) {
  this.username = m.prop(name)
  this.repos = m.prop([])
  this.getRepos = () => {
    if (! this.username()) return
    getReposFor(this.username()).then(this.repos)
  }
  this.getRepos()
}

let app = {
  controller: function() {
    return {
      vm : new ViewModel(DEFAULT_USER)
    }
  },

  view: view
}

export default app
