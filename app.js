#!/usr/bin/env node

const debug = require('debug')('minimal-syntax-highlighting:app');

const fse = require('fs-extra');
const { readFile } = require('node:fs/promises');
const path = require('path');
const marked = require('marked');
const hljs = require('highlight.js');

async function load(filePath) {
  return readFile(filePath, {
    encoding: 'utf8'
  });
}

async function write(filePath, data) {
  return fse.outputFile(filePath, data);
}

console.log('starting...');

// Read template
const templatePath = path.join('index.md');
const contents = await load(templatePath);

// Render template
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});
const html = marked.parse(contents);

// Output template
const outputPath = path.join('dist', 'index.html');
await write(outputPath, html);

console.log('done');