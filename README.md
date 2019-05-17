# cordova-x-filter

Cordova hook to filter (whitelist/blacklist) files that are included in your final `.apk` to save size wich is very important! (File Tree Shaking for Cordova)

##### 2 Examples:
1. Are you using jquery? `npm install jquery --save` have you noticed it brings 144 files/folders and its 1.3MB but you only use `dist/jquery.min.js` in your cordova app 87kB...
2. Are you using the latest font-awesome? `bower install font-awesome@latest --save` it brings 3342 files/folders and 17.3MB. What? Yep! But you will probably only use `web-fonts-with-css/` folder and that's 2.3MB and you can even filter it further with this tool if you only use one of the font variants...

All this brings clutter that increases your `.apk` size if you are not careful...

[![NPM](https://nodei.co/npm/cordova-x-filter.png?downloads=true&stars=true)](https://nodei.co/npm/cordova-x-filter/)

## Install
Install the following package below inside of your apps root folder.
```
npm install cordova-x-filter --save
```
After install an `after_prepare` folder will be added to your `hooks` folder with the `x-filter.js` script in it.  A JSON config file (`x-filter-config.json`) for the script will be added to the `hooks` folder.  The hook will automatically be given executable permission.

## Usage
```
ionic cordova run android
```
or if you are releasing or changed `alwaysRun` on `x-filter-config.json`
```
ionic cordova build android --release
```
You a similar output to this:
```
CLEANING!

All Files: 3630
Whitelisted Files: 101
Blacklisted Files: 0

FINISHED
```

## Default Configuration
```javascript
{
    "alwaysRun": true,
    "whitelist": [
		"index.html",
		"cordova.js",
		"cordova_plugins.js",
		"plugins/**",
		"cordova-js-src/**",

		"js/**"
    ],
    "blacklist": [
    ]
}
```
(Those are the minimum required files for a Cordova app to work.)
(Pro Tip: open Chrome Developer Tools Inspector and see what files your app are missing in the `Network` tab and include only those until the app works, use the app a bit and repeat)

## Using cordova-x-filter with Ionic 2
I haven't used Ionic 2 but apparently you might need to add `build` on your files/folders whitelisted/blacklisted

## Requirements
Latest Cordova/Android (Cordova Android 7.0.0?) because they changed the folder structure.... if you are using a previous version change this line(s): https://github.com/rossmartin/cordova-uglify/issues/41
