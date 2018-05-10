const expect = require('chai').expect;
const spawn = require('child_process').spawn;

describe('ftpress', () =>
{
	it('success', done =>
	{
		spawn('grunt ftpress:success').on('exit', code =>
		{
			expect(code).to.match(0);
			done();
		});
	});

	it('error', done =>
	{
		spawn('grunt ftpress:error').on('exit', code =>
		{
			expect(code).to.match(1);
			done();
		});
	});
});
