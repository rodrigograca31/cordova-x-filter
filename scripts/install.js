#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var cwd = process.cwd(); // $(project)/node_modules/x-filter
// __dirname = $(project)/node_modules/x-filter/scripts

var paths = [path.join(cwd, '../../hooks'), path.join(cwd, '../../hooks/after_prepare')];

for (var pathIndex in paths) {
  if (!fs.existsSync(paths[pathIndex])) {
    console.log('Creating directory: ', paths[pathIndex]);
    fs.mkdirSync(paths[pathIndex]);
  }
}

var uglifyScriptPath = path.join(cwd, 'after_prepare', 'x-filter.js');

var uglifyFile = fs.readFileSync(uglifyScriptPath);
var uglifyAfterPreparePath = path.join(paths[1], 'x-filter.js');

fs.writeFileSync(uglifyAfterPreparePath, uglifyFile);

var uglifyConfigFile = fs.readFileSync(path.join(__dirname, '../x-filter-config.json'));
fs.writeFileSync(path.join(paths[0], 'x-filter-config.json'), uglifyConfigFile);

console.log('Updating hooks directory to have execution permissions...');
shell.chmod('a+x', path.join(paths[1], 'x-filter.js'));
