const grunt = require('grunt');
const urlParse = require('url-parse');
const spawn = require('child_process').spawn;
const packageObject = require('../package.json');

let optionObject = require('../option.json');

/**
 * transfer
 *
 * @since 1.0.0
 *
 * @param {string} source
 * @param {string} target
 *
 * @return {Promise}
 */

function _transfer(source, target)
{
	const transferArray = [];

	if (optionObject.protocol && optionObject.host)
	{
		transferArray.push(optionObject.protocol + '://' + optionObject.host);
	}
	if (optionObject.username && optionObject.password)
	{
		transferArray.push('-u', optionObject.username + ':' + optionObject.password);
	}
	if (optionObject.port)
	{
		transferArray.push('-p', optionObject.port);
	}
	if (optionObject.command)
	{
		transferArray.push('-e', _parseCommand(optionObject.command, source, target));
	}
	if (optionObject.debug)
	{
		transferArray.push('-d');
		transferArray.forEach(spawnValue =>
		{
			if (spawnValue.toString().indexOf(optionObject.username + ':' + optionObject.password) > -1)
			{
				grunt.log.writeln(optionObject.username + ':' + '*'.repeat(optionObject.password.length));
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
 * parse command
 *
 * @since 1.3.0
 *
 * @param {string} command
 * @param {string} source
 * @param {string} target
 *
 * @return {string}
 */

function _parseCommand(command, source, target)
{
	const timestamp = new Date().getTime();

	return command
		.replace(new RegExp('{SOURCE}', 'g'), source)
		.replace(new RegExp('{TARGET}', 'g'), target)
		.replace(new RegExp('{TIMESTAMP}', 'g'), timestamp);
}

/**
 * parse url
 *
 * @since 1.0.0
 *
 * @param {string} url
 *
 * @return {object}
 */

function _parseUrl(url)
{
	const urlObject = new urlParse(url);

	return urlObject && urlObject.hostname ?
	{
		username: urlObject.username,
		password: urlObject.password,
		protocol: urlObject.protocol.replace(':', ''),
		host: urlObject.hostname,
		port: urlObject.port
	} : {};
}

/**
 * process
 *
 * @since 1.0.0
 *
 * @param {string} source
 * @param {string} target
 *
 * @return {void}
 */

function _process(source, target)
{
	const transferProcess = _transfer(source, target);

	if (optionObject.verbose)
	{
		transferProcess.stdout.on('data', data =>
		{
			grunt.log.writeln(data);
		});
	}
	transferProcess.stderr.on('data', data =>
	{
		grunt.log.writeln(data);
	});
	transferProcess.on('exit', code =>
	{
		code === 0 ? grunt.log.ok(source + ' > ' + target) : grunt.fail.warn(source + ' !== ' + target);
	});
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @return {void}
 */

function init()
{
	const urlObject = _parseUrl(this.options().url ? this.options().url : optionObject.url);
	const done = this.async;

	optionObject =
	{
		...optionObject,
		...this.options(),
		...urlObject
	};

	/* stringify command */

	if (typeof optionObject.command === 'object')
	{
		optionObject.command = optionObject.command.join(';');
	}

	/* process files */

	this.files.forEach(fileValue =>
	{
		fileValue.orig.src.forEach(sourceValue =>
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
 * @param {object} grunt
 *
 * @return {void}
 */

function construct(grunt)
{
	grunt.registerMultiTask('ftpress', packageObject.description, init);
}

module.exports = construct;
