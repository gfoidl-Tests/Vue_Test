const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions }         = require("../../tsconfig");
const path                        = require("path");
//-----------------------------------------------------------------------------
module.exports = {
    name                : "vue",
    displayName         : "vue component tests",
    moduleFileExtensions: ["js", "ts", "json", "vue"],
    transform           : {
        "^.+\\.vue$": "vue-jest",
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/*.ts"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: path.normalize(path.join("<rootDir>", "../../"))
    }),
    // helper (above) is used to automate this
    //moduleNameMapper: {
    //    "^@/(.*)$"   : "<rootDir>/src/ts/$1",
    //    "^@svc/(.*)$": "<rootDir>/src/ts/services/$1"
    //},
    coverageReporters: ["text", "cobertura", "html"],   // https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
    globals          : {
        VERSION: "42"
    }
};
