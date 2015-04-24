"use strict"
/* eslint-env browser */

import app from './app'
import m from 'mithril'

m.module(document.getElementById("content"), app);

