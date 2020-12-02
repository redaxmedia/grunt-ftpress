const grunt = require('grunt');
const urlParse = require('url-parse');
const spawn = require('child_process').spawn;
const option = require('utility-redaxmedia').option(__dirname + '/../option.json');
const helper = require('utility-redaxmedia').helper;
const packageObject = require('../package.json');

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
	if (option.get('debug'))
	{
		transferArray.push('-d');
		transferArray.forEach(spawnValue =>
		{
			if (spawnValue.toString().indexOf(option.get('username') + ':' + option.get('password')) > -1)
			{
				grunt.log.writeln(option.get('username') + ':' + '*'.repeat(option.get('password').length));
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

	if (option.get('verbose'))
	{
		transferProcess.stdout.on('data', data =>
		{
			grunt.log.writeln(data);
		});
	}
	transferProcess.stderr.on('data', data =>
	{
		grunt.log.errorlns(data);
	});
	transferProcess.on('close', code =>
	{
		code === 0 ? grunt.log.ok(source + ' > ' + target) : grunt.fatal(source + ' !== ' + target);
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
