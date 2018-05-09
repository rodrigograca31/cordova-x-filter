#!/usr/bin/env node

/*jshint latedef:nofunc, node:true*/

// Modules
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');

// Process
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var cliCommand = process.env.CORDOVA_CMDLINE;

// Hook configuration
var configFilePath = path.join(rootDir, 'hooks/x-filter-config.json');
var hookConfig = JSON.parse(fs.readFileSync(configFilePath));
var isRelease = hookConfig.alwaysRun || (cliCommand.indexOf('--release') > -1);

var whitelist = hookConfig.whitelist;
var blacklist = hookConfig.blacklist;

// Exit
if (!isRelease) {
	return;
}

console.log("\nCLEANING!\n");

// Run
run();

console.log("\nFINISHED\n");

/**
 * Run compression for all specified platforms.
 * @return {undefined}
 */
function run() {
	platforms.forEach(function(platform) {
		var wwwPath;

		switch (platform) {
			case 'android':
				wwwPath = path.join(platformPath, platform, 'app', 'src', 'main', 'assets', 'www');
				break;

			case 'ios':
			case 'browser':
			case 'wp8':
			case 'windows':
				wwwPath = path.join(platformPath, platform, 'www');
				break;

			default:
				console.log('this hook only supports android, ios, wp8, windows, and browser currently');
			return;
		}

		var allFiles = Array();
		var whiteFiles = Array();
		var blackFiles = Array();

		allFiles = processPattern(path.join(wwwPath, "/**"));
		allFiles.shift(); //remove "www" from the array or delets everything

		if(whitelist.length){
			whitelist.forEach(function(folder) {
				// forEach because if I use ".concat" it stops working (not synchronous?)
				processPattern(path.join(wwwPath, folder)).forEach(function(file) {
					whiteFiles.push(file);
				});
			});
		}
		if(blacklist.length){
			blacklist.forEach(function(folder) {
				// forEach because if I use ".concat" it stops working (not synchronous?)
				processPattern(path.join(wwwPath, folder)).forEach(function(file) {
					blackFiles.push(file);
				});
			});
		}

		/*
		 * LOGGING
		 */
		console.log('All Files: ' + allFiles.length);
		console.log('Whitelisted Files: ' + whiteFiles.length);
		console.log('Blacklisted Files: ' + blackFiles.length);

		if(whitelist.length){
			allFiles.forEach(function(elem){
				if(elem.indexOf())
				if (!filterFile(whiteFiles, elem)) {
					// not in whitelist, delete
					fs.removeSync(elem);
				}
			});
		}
		if(blacklist.length){
			blackFiles.forEach(function(elem){
				fs.removeSync(elem);
			});
		}

		// TODO: log how many deletes and how many allowed....?

		// process.exit(1); // for debug
		return;

	});
}

/**
 * Processes defined folders.
 * @param  {string} wwwPath - Path to www directory
 * @param  {array} list - Array of paths
 * @return {array} files - List that matched pattern
 */
function getThisOnes(wwwPath, list) {
	var tempFiles = Array();
	list.forEach(function(folder) {
		tempFiles.push(processPattern(path.join(wwwPath, folder)));
	});
	return tempFiles;
}

/**
 * Processes pattern and return list of directories and files
 * @param  {string} pattern - Pattern to be matched
 * @return {array} files - List that matched pattern
 */
function processPattern(pattern) {
	return glob.sync(pattern, {dot: true});
}

/**
 * Filters array for file because this way finds if a directory is being used by any file.
 * @param  {array}
 * @param  {file}
 * @return {number} number of times the file shows up in the Array
 */
function filterFile(fileList, file) {
	// this check avoids "/path/to/file2" staying if "/path/to/file" is whitelisted
	if(fs.existsSync(file) && fs.statSync(file).isDirectory()){
		return fileList.filter(function(str) {
			return str.indexOf(file) != -1;
		}).length;
	}
	return fileList.indexOf(file) != -1;
}

