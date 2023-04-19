exports.logConfig = {
    levels: {
        access: {
            color: '#89f5a0',
            writeToConsole: true,
            writeToFile: false
        },
        info: {
            color: '#0ae0f7',
            writeToConsole: true,
            writeToFile: false
        },
        debug: {
            color: '#f5f1ed',
            writeToConsole: true,
            writeToFile: false
        },
        warn: {
            color: '#facc4d',
            writeToConsole: true,
            writeToFile: false
        },
        database: {
            color: '#9142eb',
            writeToConsole: true,
            writeToFile: false
        },
        system: {
            color: '#d4d9bd',
            writeToConsole: true,
            writeToFile: false
        },
        event: {
            color: '#ff00ff',
            writeToConsole: true,
            writeToFile: false
        },
        error: {
            color: '#cc0404',
            writeToConsole: true,
            writeToFile: false
        },
        fatal: {
            color: '#910909',
            writeToConsole: true,
            writeToFile: false
        }
    },
    types: {
        classical: {
            color: '#00FFFF', //cyan
            name: 'Classical Bloom'
        },
        counting: {
            color: '#0000FF', //blue
            name: 'Counting Bloom'
        },
        partitioned: {
            color: '#A020F0', //purple,
            name: 'Partitioned Bloom'
        },
        scalable: {
            color: '#FFFF00', //yellowDark
            name: 'Scalable Bloom'
        },
        cuckoo: {
            color: '#FF00CD', //magentaBright
            name: 'Cuckoo Bloom'
        },
        default: {
            color: '#AAFF00', //greenBright
            name: 'Blumea Logger'
        }
    }
}
