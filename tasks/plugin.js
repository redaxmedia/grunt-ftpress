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
	const transferArray = [];

	if (optionArray.protocol && optionArray.host)
	{
		transferArray.push(optionArray.protocol + '://' + optionArray.host);
	}
	if (optionArray.username && optionArray.password)
	{
		transferArray.push('-u');
		transferArray.push(optionArray.username + ':' + optionArray.password);
	}
	if (optionArray.port)
	{
		transferArray.push('-p');
		transferArray.push(optionArray.port);
	}
	if (optionArray.command)
	{
		transferArray.push('-e');
		transferArray.push(optionArray.command.replace('{SOURCE}', source).replace('{TARGET}', target));
	}
	if (optionArray.debug)
	{
		transferArray.push('-d');
		transferArray.forEach(spawnValue =>
		{
			if (spawnValue.toString().indexOf(optionArray.username + ':' + optionArray.password) > -1)
			{
				grunt.log.writeln(optionArray.username + ':*****');
			}
			else
			{
				grunt.log.writeln(spawnValue);
			}
		});
	}
	return spawn('lftp', transferArray);
}

/**
 * parse
 *
 * @since 1.0.0
 *
 * @param url string
 *
 * @return object
 */

function _parse(url)
{
	const urlParse = new UrlParse(url);

	return urlParse && urlParse.hostname ?
	{
		username: urlParse.username,
		password: urlParse.password,
		protocol: urlParse.protocol.replace(':', ''),
		host: urlParse.hostname,
		port: urlParse.port
	} : {};
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

	transfer.stderr.on('data', data =>
	{
		grunt.log.writeln(data);
	});
	transfer.on('exit', code =>
	{
		code === 0 ? grunt.log.ok(source + ' > ' + target) : grunt.log.error(source + ' ==! ' + target);
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

	optionArray = extend(optionArray, this.options());
	optionArray = extend(optionArray, _parse(optionArray.url));

	/* process files */

	this.files.forEach(fileValue =>
	{
		fileValue.src.forEach(sourceValue =>
		{
			_process(sourceValue, fileValue.dest ? fileValue.dest : sourceValue);
		});
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
