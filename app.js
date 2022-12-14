#!/usr/bin/env node

const debug = require('debug')('minimal-syntax-highlighting:app');

const fse = require('fs-extra');
const { readFile } = require('node:fs/promises');
const path = require('path');
const marked = require('marked');
const hljs = require('highlight.js');

console.log('starting...');

// Read template
const templatePath = path.join('index.md');

let content;

(async () => {
  try {
    contents = await readFile(templatePath, {
      encoding: 'utf8'
    });
  }
  catch(e) {
    console.error(e.message);
    console.error(e.stack);
    process.exit(1);
  }
})(); 

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
const renderedContent = marked.parse(contents);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>minimal-syntax-highlighting</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
</head>
<body>
  ${renderedContent}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"</script>
</body>
</html>
`;

// Output template
const outputPath = path.join('dist', 'index.html');

(async () => {
  try {
    await fse.outputFile(outputPath, html);
  }
  catch(e) {
    console.error(e.message);
    console.error(e.stack);
    process.exit(1);
  }
})(); 

console.log('done');