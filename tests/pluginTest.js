const expect = require('chai').expect;
const exec = require('child_process').exec;

describe('ftpress', () =>
{
	it('success', done =>
	{
		exec('grunt ftpress:success', (error, stdout) =>
		{
			expect(stdout).to.match(/tests\/provider > tests\/provider/);
			done();
		});
	})
	.timeout(10000);

	it('error', done =>
	{
		exec('grunt ftpress:error', () =>
		{
			done();
		});
	});
});
