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
				dest: '.'
			},
			error:
			{
				src:
				[
					'tests/invalid'
				],
				dest: '.'
			},
			options:
			{
				username: 'demo',
				password: 'password',
				protocol: 'sftp',
				host: 'test.rebex.net',
				port: 22,
				command:
				[
					'set sftp:auto-confirm yes',
					'mirror {SOURCE} {TARGET} --reverse --dry-run',
					'exit'
				],
				debug: true
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
