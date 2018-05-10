const grunt = require('grunt');
const extend = require('extend');
const UrlParse = require('url-parse');
const spawn = require('child_process').spawn;
const packageArray = require('../package.json');

let optionArray = require('../option.json');

/**
 * transfer
 *
 * @since 1.0.0
 *
 * @param source string
 * @param target string
 *
 * @return Promise
 */

function _transfer(source, target)
{
	return spawn('lftp',
	[
		optionArray.protocol + '://' + optionArray.host,
		'-u',
		optionArray.username + ':' + optionArray.password,
		optionArray.port ? '-p' : null,
		optionArray.port ? optionArray.protocol : null,
		'-e',
		optionArray.command.replace('{SOURCE}', source).replace('{TARGET}', target)
	]);
}

/**
 * process
 *
 * @since 1.0.0
 *
 * @param source string
 * @param target string
 */

function _process(source, target)
{
	const transfer = _transfer(source, target);

	transfer.on('exit', code =>
	{
		return code === 0 ? grunt.log.ok(source + ' > ' + target) : grunt.log.error(source + ' !== ' + target);
	});
}

/**
 * init
 *
 * @since 1.0.0
 */

function init()
{
	const done = this.async;
	const url = new UrlParse(process.env.FTPRESS_URL);

	optionArray = extend(optionArray, this.options(), url ?
	{
		username: url.username,
		password: url.password,
		protocol: url.protocol.replace(':', ''),
		host: url.hostname,
		port: url.port
	} : {});

	/* process files */

	this.files.forEach(fileValue =>
	{
		if (fileValue.dest)
		{
			_process(fileValue.src, fileValue.dest);
		}
		else
		{
			fileValue.src.forEach(sourceValue =>
			{
				_process(sourceValue, sourceValue);
			});
		}
	});
	done();
}

/**
 * construct
 *
 * @since 1.0.0
 *
 * @param grunt object
 */

function construct(grunt)
{
	grunt.registerMultiTask('ftpress', packageArray.description, init);
}

module.exports = construct;
