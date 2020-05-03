const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions }         = require("../../tsconfig");
const path                        = require("path");
//-----------------------------------------------------------------------------
module.exports = {
    rootDir             : "../../",
    name                : "unit",
    displayName         : "unit tests",
    moduleFileExtensions: ["js", "ts", "json"],
    transform           : {
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/tests/unit/**/*.ts"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>"
    }),
    // helper (above) is used to automate this
    //moduleNameMapper: {
    //    "^@/(.*)$"   : "<rootDir>/src/ts/$1",
    //    "^@svc/(.*)$": "<rootDir>/src/ts/services/$1"
    //},
    globals          : {
        VERSION: "42"
    }
};
