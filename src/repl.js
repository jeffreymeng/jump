"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lexer_1 = __importDefault(require("./lexer/Lexer"));
const Source_1 = __importDefault(require("./lexer/Source"));
const readline = __importStar(require("readline"));
const Parser_1 = __importDefault(require("./parser/Parser"));
const fs_1 = require("fs");
const util = __importStar(require("util"));
// const s = `"hello" 2 0.2 42.294 "23.1"`;
// const expected = [
// 	new Token(TOKEN_TYPE.STRING_LITERAL, "hello"),
// 	new Token(TOKEN_TYPE.INT_LITERAL, "2"),
// 	new Token(TOKEN_TYPE.DOUBLE_LITERAL, "0.2"),
// 	new Token(TOKEN_TYPE.DOUBLE_LITERAL, "42.294"),
// 	new Token(TOKEN_TYPE.STRING_LITERAL, "23.1")
// ]
function drawTree() { }
async function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const getInput = async (question) => await new Promise((res, rej) => rl.question(question, (answer) => res(answer)));
    console.log("Jump REPL v0.0.2");
    console.log("Type exit to exit, detail for details on last entry.");
    // persist to allow the debug keyword to go back one
    let source;
    while (true) {
        const input = await getInput("Jump> ");
        if (input === "exit")
            break;
        if (input.startsWith("detail")) {
            // it can either be 'detail' or 'detail [filepath]'
            if (input.split(" ").length <= 2) {
                const details = [];
                if (!source) {
                    details.push("Unable to debug as no expressions have been executed yet.");
                    continue;
                }
                const lexer = new Lexer_1.default(source.clone());
                details.push("=== DETAIL VIEW ===");
                details.push("Lexer: ");
                try {
                    details.push(Array.from(lexer));
                    try {
                        details.push("Parser: ");
                        details.push(new Parser_1.default(lexer.clone()).getRoot());
                    }
                    catch (e) {
                        details.push("Parser failed with error: ");
                        details.push(e);
                    }
                }
                catch (e) {
                    details.push("Lexer failed with error: ");
                    details.push(e);
                }
                details.push("===================");
                if (input.split(" ").length === 1) {
                    details.forEach((line) => console.log(line));
                }
                else if (input.split(" ")[1]) {
                    const path = input.split(" ")[1];
                    await fs_1.promises.writeFile(path, details
                        .map((obj) => typeof obj === "string" ? obj : util.inspect(obj))
                        .join("\n"), "utf8");
                }
                continue;
            }
        }
        try {
            source = new Source_1.default(input);
            const lexer = new Lexer_1.default(source);
            const root = new Parser_1.default(lexer).getRoot();
            console.log(root.evaluate());
        }
        catch (e) {
            console.log(e);
        }
    }
    rl.close();
}
repl();
