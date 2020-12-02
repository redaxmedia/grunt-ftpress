const exec = require('child_process').exec;

describe('ftpress', () =>
{
	it('success', done =>
	{
		exec('grunt ftpress:success', error => error ? done('error') : done());
	});

	it('errorFileNotFound', done =>
	{
		exec('grunt ftpress:errorFileNotFound', error => error ? done() : done('error'));
	});

	it('errorPermissionDenied', done =>
	{
		exec('grunt ftpress:errorPermissionDenied', error => error ? done() : done('error'));
	});
});
