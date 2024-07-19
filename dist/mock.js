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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const database_1 = require("./database");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}
function draft() {
    return __awaiter(this, void 0, void 0, function* () {
        let draftOrder = yield (0, database_1.getDraftOrder)();
        let prospects = yield (0, database_1.getProspects)();
        let currPick = 1;
        console.log('The 2025 NFL draft has begun!\n');
        while (Object.keys(draftOrder).length > 0) {
            console.log(`The ${draftOrder[currPick]} are on the clock with pick #${currPick}.\n`);
            console.log('Draft Choices:');
            console.log('1. Make a Pick');
            console.log('2. Make a Trade');
            let choice = parseInt(yield askQuestion('Enter your choice (1-2): '));
            switch (choice) {
                case 1: {
                    console.log("You've chosen to make a pick.");
                    console.log('The available prospects are: ');
                    for (let i = 0; i < prospects.length; i++) {
                        if (prospects[i]) {
                            console.log(`${i + 1}: ${prospects[i]}`);
                        }
                    }
                    let prospectSelection = parseInt(yield askQuestion('Select the number of the prospect: '));
                    if (prospectSelection >= 0 && prospectSelection < prospects.length && prospects[prospectSelection]) {
                        console.log(`The ${draftOrder[currPick]} have selected ${prospects[prospectSelection]} at pick #${currPick}.\n`);
                        prospects.splice(prospectSelection, 1); // Remove the selected prospect
                    }
                    else {
                        console.log('Invalid selection. Please select a valid prospect number.');
                    }
                    break;
                }
                case 2:
                    console.log("You've chosen to make a trade.");
                    break;
                default:
                    console.log('Please select a valid option (1-2).\n');
                    break;
            }
            delete draftOrder[currPick];
            currPick++;
        }
        console.log('The first round of the 2025 NFL draft is now complete!');
        rl.close();
    });
}
draft();
