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
