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
				'build'
			],
			dest: '.',
			options:
			{
				url: null,
				username: null,
				password: null,
				protocol: 'ftp',
				host: null,
				port: 21,
				command:
				[
					'mirror {SOURCE} {TARGET} --reverse --delete-first --parallel=10 --use-pget-n=10',
					'exit'
				],
				debug: false,
				verbose: false
			}
		}
	}
});
```

Zero downtime pattern:

```js
command:
[
	'mirror {SOURCE} {TARGET}-new-{TIMESTAMP} --reverse --delete-first',
	'mv {TARGET} {TARGET}-old-{TIMESTAMP}',
	'mv {TARGET}-new-{TIMESTAMP} {TARGET}',
	'rm -rf {TARGET}-old-{TIMESTAMP}',
	'exit'
]
```

Run the task:

```
grunt ftpress
```

