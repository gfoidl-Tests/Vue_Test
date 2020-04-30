const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions }         = require("./tsconfig");
//-----------------------------------------------------------------------------
module.exports = {
    moduleFileExtensions: ["js", "ts", "json", "vue"],
    transform           : {
        "^.+\\.vue$" : "vue-jest",
        "^.+\\.tsx?$": "ts-jest"
    },
    testMatch: [
        "**/tests/vue/**/*.[tj]s",
        "**/tests/unit2/**/*.[tj]s"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
    }),
    // helper is used to automate this
    //moduleNameMapper: {
        //"^@/(.*)$"   : "<rootDir>/src/ts/$1",
        //"^@svc/(.*)$": "<rootDir>/src/ts/services/$1"
    //}
    coverageReporters: ["text", "cobertura", "html"]    // https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
};
