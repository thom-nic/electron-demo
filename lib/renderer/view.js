/** @jsx m */
'use strict';

import m from 'mithril'

function view(ctrl) {
  return [
    <div class='row'>
      <div class='four columns'>
      <input type='text' placeholder='Github username' 
             name='gh_username' class='u-full-width'
             onchange={m.withAttr("value", ctrl.vm.username)}
             value={ctrl.vm.username()} />
      </div>
      <div class='eight columns'>
        <button onclick={ctrl.vm.getRepos} class='button-primary'>Show Repos</button>
      </div>
    </div>,
    <div class='row'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          { ctrl.vm.repos().filter(noForks).sort(latestFirst).map(link) }
        </tbody>
      </table>
    </div>
  ]
}

function link(repo) {
  return (
    <tr>
      <td>
        <a href={repo.html_url} target='_blank'>{repo.name}</a>
      </td>
      <td>{repo.description}</td>
      <td>{repo.pushed_at}</td>
    </tr>
  )
}

function noForks(repo) {
  if ( ! repo.fork ) return repo
}

function latestFirst(a,b) {
  return new Date(b.pushed_at) - new Date(a.pushed_at)
}

export default view
