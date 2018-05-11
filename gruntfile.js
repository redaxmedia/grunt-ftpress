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
				dest: 'tests/provider'
			},
			error:
			{
				src:
				[
					'tests/invalid'
				],
				dest: 'tests/invalid'
			},
			options:
			{
                username: 'demo-user',
                password: 'demo-user',
                protocol: 'ftp',
                host: 'demo.wftpserver.com',
                port: 21,
                command: 'set ssl:verify-certificate false; mirror {SOURCE} {TARGET} --reverse --delete-first --parallel=10 --use-pget-n=10; exit',
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
