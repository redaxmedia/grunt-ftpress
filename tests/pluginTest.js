const expect = require('chai').expect;
const exec = require('child_process').exec;

describe('ftpress', () =>
{
	it('success', done =>
	{
		exec('grunt ftpress:success', (error, stdout) =>
		{
			expect(stdout).to.match(/tests\/provider > ./);
			done();
		});
	});

	it('error', done =>
	{
		exec('grunt ftpress:error', () =>
		{
			done();
		});
	});
});
