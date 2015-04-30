'use strict';

import m from 'mithril'

function view(ctrl) {
  return [
    m('.row',[
      m('.four.columns',[
        m('input.u-full-width',{
          type:'text', placeholder:'Github username',
          name:'gh_username'
          onchange: m.withAttr("value", ctrl.vm.username),
          value: ctrl.vm.username() })
      ]),
      m('.eight.columns',[
        m('button.button-primary', {onclick: ctrl.vm.getRepos}, "Show Repos")
      ])
    ]),
    m('.row',[
      m('table',[
        m('thead',[m('tr',[m('th','Name'),m('th','Description'),m('th','Last Updated')])]),
        m('tbody', ctrl.vm.repos().filter(noForks).sort(latestFirst).map(link) )
      ])
    ])
  ]
}

function link(repo) {
  return (
    m('tr',[
      m('td',[ m('a',{href: repo.html_url, target:'_blank'}, repo.name) ]),
      m('td',repo.description),
      m('td',repo.pushed_at)
    ])
  )
}

function noForks(repo) {
  if ( ! repo.fork ) return repo
}

function latestFirst(a,b) {
  return new Date(b.pushed_at) - new Date(a.pushed_at)
}

export default view
