"use strict";
/* eslint-env browser */

require('babel/register');
var app = require('./app'),
    m = require('mithril')

m.module(document.querySelector("github-repos"), app)

