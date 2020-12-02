const os = require('os');
const grunt = require('grunt');
const urlParse = require('url-parse');
const spawn = require('child_process').spawn;
const option = require('utility-redaxmedia').option(__dirname + '/../option.json');
const helper = require('utility-redaxmedia').helper;
const packageObject = require('../package.json');

let hasError = false;

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

	if (option.get('protocol') && option.get('host'))
	{
		transferArray.push(option.get('protocol') + '://' + option.get('host'));
	}
	if (option.get('username') && option.get('password'))
	{
		transferArray.push('-u', option.get('username') + ':' + option.get('password'));
	}
	if (option.get('port'))
	{
		transferArray.push('-p', option.get('port'));
	}
	if (option.get('command'))
	{
		transferArray.push('-e', _parseCommand(option.get('command'), source, target));
	}
	if (option.get('debug') || option.get('haltOnError'))
	{
		transferArray.push('-d');
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
	const haltOnError = option.get('haltOnError');

	if (option.get('verbose'))
	{
		transferProcess.stdout.on('data', data =>
		{
			grunt.log.writeln(data);
		});
	}
	transferProcess.stderr.on('data', data =>
	{
		const dataArray = data.toString().split(os.EOL).filter(value => value);

		dataArray.map(dataValue =>
		{
			if (_findError(dataValue))
			{
				hasError = true;
				grunt.log.errorlns(dataValue);
			}
			else if (option.get('debug'))
			{
				grunt.log.writeln(dataValue);
			}
		});
	});
	transferProcess.on('close', error =>
	{
		haltOnError && (error || hasError) ? grunt.fatal(source + ' !== ' + target) : grunt.log.ok(source + ' > ' + target);
	});
}

/**
 * findError
 *
 * @since 1.6.0
 *
 * @param {string} dataValue
 *
 * @return {boolean}
 */

function _findError(dataValue)
{
	const errorArray = option.get('errorArray');

	let hasError = false;

	errorArray.map(error =>
	{
		if (dataValue.includes(error))
		{
			hasError = true;
		}
	});
	return hasError;
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
	const urlObject = _parseUrl(this.options().url ? this.options().url : option.get('url'));
	const done = this.async;

	option.init(
	{
		...this.options(),
		...helper.object.tidy(urlObject)
	});

	/* stringify command */

	if (typeof option.get('command') === 'object')
	{
		option.set('command', option.get('command').join(';'));
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
