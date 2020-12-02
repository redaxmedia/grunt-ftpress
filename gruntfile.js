module.exports = grunt =>
{
	'use strict';

	/* config grunt */

	grunt.initConfig(
	{
		ftpress:
		{
			success:
			{
				src:
				[
					'tests/provider'
				],
				dest: '.',
				options:
				{
					command:
					[
						'mirror {SOURCE} {TARGET} --reverse --dry-run',
						'exit'
					]
				}
			},
			errorFileNotFound:
			{
				src:
				[
					'tests/invalid'
				],
				dest: '.'
			},
			errorPermissionDenied:
			{
				src:
				[
					'tests/provider'
				],
				dest: '.',
				options:
				{
					username: 'invalid',
					password: 'invalid'
				}
			},
			options:
			{
				username: 'demo',
				password: 'demo',
				protocol: 'sftp',
				host: 'demo.wftpserver.com',
				port: 2222,
				command:
				[
					'mirror {SOURCE} {TARGET} --reverse',
					'exit'
				],
				debug: true,
				verbose: true,
				haltOnError: true
			}
		}
	});

	/* load tasks */

	grunt.loadTasks('tasks');

	/* register tasks */

	grunt.registerTask('default',
	[
		'ftpress'
	]);
};
