"use strict";
/* eslint-env browser, node */

var view = require('./view'),
    m = require('mithril')

var app = {};

app.controller = function() {
  var _pages = [
      {url: "foo", title: "foo"},
      {url: "bar", title: "bar"},
      {url: "baz", title: "baz"},
    ] 
  var pages = function() {
    return _pages
  }
  return {
    pages: pages,
    rotate: function() {
      pages().push(pages().shift());
    }
  }
};

app.view = view

m.module(document.getElementById("example"), app);
