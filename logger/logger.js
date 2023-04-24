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

let logActiveDisplayed = false;
let logInactiveDisplayed = false;

const blumeaLogger = (type = null, message = null, error = null) => {
    if (!type) {
        type = 'default'
    }
    if (error) {
        log('[type: ' + chalk.hex(logConfig.types[type].color).bold(logConfig.types[type].name) + ', log: ' + chalk.hex(logConfig.levels.error.color).bold(error.toString()) + ']');
        return;
    }

    if (!message) {
        warn(chalk.blackBright.bold('[*] blumea-logger: Invalid log message provided'));
    } else {
        log('[type: ' + chalk.hex(logConfig.types[type].color).bold(logConfig.types[type].name) + ', log: ' + chalk.hex(logConfig.types[type].color).bold(message.toString()) + ']');
    }
}

const displayLoggerDetails = () => {
    log('\n' + chalk.blackBright.bold(`[*] Using Blumea v${version} with the app.`));
}

const displayLogActive = () => {
    if (logActiveDisplayed) {
        return;
    } else {
        logActiveDisplayed = true;
        log(chalk.greenBright.bold('[*] Blumea Logger is active...'));
        log(chalk.greenBright('██████╗ ██╗     ██╗   ██╗███╗   ███╗███████╗ █████╗\n██╔══██╗██║     ██║   ██║████╗ ████║██╔════╝██╔══██╗\n██████╔╝██║     ██║   ██║██╔████╔██║█████╗  ███████║\n██╔══██╗██║     ██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██║\n██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║\n╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝'))
        // log(styles`${styles.bold}${styles.blackBright}[*] Blumea Logger is active...${styles.x}${styles.x}`)
    }
}

const displayLogInactive = () => {
    if (logInactiveDisplayed) {
        return;
    } else {
        logInactiveDisplayed = true;
        log(chalk.blackBright.bold('[*] Blumea Logger is disabled...'));
        log(chalk.blackBright.bold('[*] Use ') + chalk.cyan.bold('-l or -log or -blumea') + chalk.blackBright.bold(' flag to activate blumea logger.'));
    }
}

const isLogsActive = () => {
    for (let flag of flags) {
        if (flag === '-l' || flag === '-log' || flag === '-blumea') {
            displayLogActive();
            return true;
        }
    }
    displayLogInactive();
    return false;
}

module.exports = { displayLoggerDetails, isLogsActive, blumeaLogger }