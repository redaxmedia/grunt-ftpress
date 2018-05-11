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
                username: 'demo-user',
                password: 'demo-user',
				protocol: 'sftp',
                host: 'demo.wftpserver.com',
				port: 2222,
                command: 'set sftp:auto-confirm yes; mirror {SOURCE} {TARGET} --reverse --delete-first --dry-run; exit',
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
