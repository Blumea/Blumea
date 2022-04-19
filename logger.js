/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const flags = process.argv
const styles = require('terminal-styles')

const isLogsActive = ()=>{
    for(let flag of flags){
        if(flag === '-l' || flag === '-log' || flag === '-blumea'){
            console.log(styles `${styles.bold}${styles.blackBright}[*]Blumea Logger is active...${styles.x}${styles.x}`)
            return true;
        }
    }
    console.log(styles `${styles.bold}${styles.blackBright}[*]Blumea Logger is disabled...${styles.x}${styles.x}`)
    console.log(styles `${styles.bold}${styles.blackBright}[*]Use ${styles.cyanBright}-l or -log or -blumea ${styles.x}${styles.blackBright}flag to activate blumea logger.${styles.x}${styles.x}${styles.x}`)
    return false;
}
module.exports = isLogsActive