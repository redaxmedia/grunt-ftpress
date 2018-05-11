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
                host: 'demo.wftpserver.com',
                command: 'set ssl:verify-certificate false; mirror {SOURCE} {TARGET} --reverse --delete-first --dry-run; exit',
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
