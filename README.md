Grunt Ftpress
=============

> Grunt enhanced file transfer with speed in mind.

[![Build Status](https://img.shields.io/travis/redaxmedia/grunt-ftpress.svg)](https://travis-ci.org/redaxmedia/grunt-ftpress)
[![NPM Version](https://img.shields.io/npm/v/grunt-ftpress.svg)](https://npmjs.com/package/grunt-ftpress)
[![Licensen](https://img.shields.io/npm/l/grunt-ftpress.svg)](https://npmjs.com/package/grunt-ftpress)


Installation
------------

```
apt-get install lftp
```

```
npm install grunt-lftpress
```


Usage
-----

Load the task:

```js
grunt.loadNpmTasks('grunt-ftpress');
```

Config the task:

```js
grunt.initConfig(
{
	ftpress:
	{
		name:
		{
			src:
			[
				'.'
			],
			dest: '.',
			options:
			{
				username: null,
				password: null,
 				protocol: 'ftp',
				host: null,
				port: 21,
				command: 'mirror {SOURCE} {TARGET} --reverse --delete-first --parallel=10; exit',
				debug: false
			}
		}
	}
}
```

Run the task:

```
grunt ftpress
```

Run the task using the `url` option:

```
grunt ftpress --url=sftp://username:password@host:22
```
