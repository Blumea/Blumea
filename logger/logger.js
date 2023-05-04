/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const flags = process.argv
const { log, warn } = require('console')
const { logConfig } = require('./config');
const chalk = require('chalk');
const { version } = require('../package.json')


let metadata = {
    defaults: {
        type: 'default',
        color: {
            hex: logConfig.types.default.color,
            name: 'greenBright'
        }
    },
    flags: {
        debugActiveMode: false,
        debugInactiveMode: false
    }
}

const blumeaLogger = (type = null, message = null, error = null) => {
    if (!type) {
        type = 'default'
    }
    if (error) {
        log('[type: ' + chalk.hex(logConfig.types[type].color).bold(logConfig.types[type].name) + ', log: ' + chalk.hex(logConfig.levels.error.color).bold(error.toString()) + ']');
        return;
    }

    if (!message) {
        warn(chalk.blackBright.bold('> blumea-logger: Invalid log message provided'));
    } else {
        log('[type: ' + chalk.hex(logConfig.types[type].color).bold(logConfig.types[type].name) + ', log: ' + chalk.hex(logConfig.types[type].color).bold(message.toString()) + ']');
    }
}

const initialize = () => {
    log('\n' + chalk.blackBright.bold(`> Using Blumea v${version} with the app.`));

    for (let flag of flags) {
        if (flag === '-l' || flag === '-log' || flag === '-blumea') {
            metadata.flags.debugActiveMode = true;
        }
    }
    metadata.flags.debugInactiveMode = true;

    display();
}

const display = () => {
    if (metadata.flags.debugActiveMode) {
        log(chalk.greenBright.bold('> Blumea Logger is enabled...'));
        log(chalk.greenBright('██████╗ ██╗     ██╗   ██╗███╗   ███╗███████╗ █████╗\n██╔══██╗██║     ██║   ██║████╗ ████║██╔════╝██╔══██╗\n██████╔╝██║     ██║   ██║██╔████╔██║█████╗  ███████║\n██╔══██╗██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██║\n██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║\n╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝'))
    } else if (metadata.flags.debugInactiveMode) {
        log(chalk.blackBright.bold('> Blumea logger is disabled...'));
        log(chalk.blackBright.bold('> Use ') + chalk.cyan.bold('-l or -log or -blumea') + chalk.blackBright.bold(' flag to enable debug mode.'));
    } else {
        return;
    }
}

// const isLogsActive = () => {
//     for (let flag of flags) {
//         if (flag === '-l' || flag === '-log' || flag === '-blumea') {
//             displayLogActive();
//             return true;
//         }
//     }
//     displayLogInactive();
//     return false;
// }

module.exports = { initialize, metadata, blumeaLogger, display }