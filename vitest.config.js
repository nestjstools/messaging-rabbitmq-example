"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        root: './src',
        include: ['**/*.spec.ts'],
        environment: 'node',
    },
});
//# sourceMappingURL=vitest.config.js.map