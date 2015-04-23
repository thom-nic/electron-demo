/** @jsx m */
'use strict';

var m = require('mithril')

var link = function(page) {
  return (
    <li>
      <a href={page.url}>{page.title}</a>
    </li>
  )
}

module.exports = function (ctrl) {
  return [
    ctrl.pages().map(link),
    <li><button onclick={ctrl.rotate}>Rotate links</button></li>
  ]
}
