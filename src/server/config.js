"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.NODE_ENV || 'development';
const config = {
    env: env,
    isProduction: env.toLowerCase() === 'production',
    isDev: env.toLowerCase() === 'development',
    isTest: env.toLowerCase() === 'test',
};
exports.default = config;
//# sourceMappingURL=config.js.map