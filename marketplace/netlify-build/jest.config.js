module.exports= {
    "transform": {
        "^.+\\.jsx?$": "babel-jest"
    },
    "moduleNameMapper": {
        "\\.(css|less)$": "identity-obj-proxy"
        //"\\.(css|less)$": "<rootDir>/test/stylemock.js"
    },
    "moduleDirectories": ["node_modules"],
};