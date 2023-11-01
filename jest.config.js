/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

/** @type {import("jest").Config} */

const config = {
    displayName: {
        name: "Blumea Unit Tests",
        color: "green"
    },
    verbose: true,
    bail: 1,
    forceCoverageMatch: ["**/*.test.js"],
    testEnvironment: "node",
};

module.exports = config;