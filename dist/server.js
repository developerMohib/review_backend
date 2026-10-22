"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const port = Number(process.env.PORT) || 4000;
async function main() {
    try {
        console.log('PostgreSQL connected succesfully with Atlas');
        index_js_1.default.listen(port, "0.0.0.0", () => {
            console.log(`Admin app listening on port ${port}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map