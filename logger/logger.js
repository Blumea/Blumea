/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const flags = process.argv
const { log } = require('console')
const styles = require('terminal-styles')
const { version } = require('../package.json')

let logActiveDisplayed = false;
let logInactiveDisplayed = false;

const displayLoggerDetails = () => {
    log('\n' + styles`${styles.bold}${styles.blackBright}[*] Using Blumea ${styles.x}${styles.x}` + 'v' + version + styles`${styles.bold}${styles.blackBright} with the current app${styles.x}${styles.x}`)
}

const displayLogActive = () => {
    if (logActiveDisplayed) {
        return;
    } else {
        logActiveDisplayed = true;
        log(styles`${styles.bold}${styles.blackBright}[*] Blumea Logger is active...${styles.x}${styles.x}`)
    }
}

const displayLogInactive = () => {
    if (logInactiveDisplayed) {
        return;
    } else {
        logInactiveDisplayed = true;
        log(styles`${styles.bold}${styles.blackBright}[*] Blumea Logger is disabled...${styles.x}${styles.x}`)
        log(styles`${styles.bold}${styles.blackBright}[*] Use ${styles.cyanBright}-l or -log or -blumea ${styles.x}${styles.blackBright}flag to activate blumea logger.${styles.x}${styles.x}${styles.x}`)
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

module.exports = { displayLoggerDetails, isLogsActive }