"use strict";
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
const database_1 = require("./database");
const trade_1 = require("./trade");
const readlineInterface_1 = require("./readlineInterface");
function draft() {
    return __awaiter(this, void 0, void 0, function* () {
        let draftCapital = yield (0, database_1.getDraftCapital)();
        let prospects = yield (0, database_1.getProspects)();
        let numRounds = parseInt(yield (0, readlineInterface_1.askQuestion)('Enter the number of rounds (1-7): '));
        console.log(`You entered: ${numRounds}`);
        const totalPicks = 32 * numRounds;
        console.log('The 2025 NFL draft has begun!\n');
        for (let currPick = 1; currPick <= totalPicks; currPick++) {
            let team = draftCapital.find(team => team.picks.includes(currPick));
            if (!team) {
                console.log(`No team found for pick #${currPick}.`);
                continue;
            }
            let pickMade = false;
            while (!pickMade) {
                console.log(`${team.team_name} is on the clock with pick #${currPick}.\n`);
                console.log(`${team.team_name} Draft Choices:`);
                console.log('1. Make a Pick');
                console.log('2. Make a Trade');
                let choice = parseInt(yield (0, readlineInterface_1.askQuestion)('Enter your choice (1-2): '));
                switch (choice) {
                    case 1: {
                        console.log("You've chosen to make a pick.");
                        console.log('The available prospects are: ');
                        for (let i = 0; i < prospects.length; i++) {
                            if (prospects[i]) {
                                console.log(`${i + 1}: ${prospects[i].name} (${prospects[i].position})`);
                            }
                        }
                        let prospectSelection = parseInt(yield (0, readlineInterface_1.askQuestion)('Select the number of the prospect: '));
                        if (prospectSelection > 0 && prospectSelection <= prospects.length) {
                            console.log(`${team.team_name} has selected ${prospects[prospectSelection - 1]} at pick #${currPick}.\n`);
                            prospects.splice(prospectSelection - 1, 1); // remove the selected prospect
                            pickMade = true;
                        }
                        else {
                            console.log('Invalid selection. Please select a valid prospect number.');
                        }
                        break;
                    }
                    case 2:
                        console.log("You've chosen to make a trade.");
                        const tradeResult = yield (0, trade_1.trade)(draftCapital);
                        if (tradeResult) {
                            // update the current team to be the team that traded for the current pick
                            team = draftCapital.find(t => t.team_name === tradeResult && t.picks.includes(currPick)) || team;
                        }
                        else {
                            console.log("Trade was not successful. Please make a pick or try another trade.");
                        }
                        break;
                    default:
                        console.log('Please select a valid option (1-2).\n');
                        break;
                }
            }
            if (currPick % 32 == 0) {
                console.log(`Round ${Math.floor(currPick / 32)} of the 2025 NFL draft is now complete!`);
            }
        }
        console.log(`Your 2025 NFL mock draft is now complete!`);
        readlineInterface_1.rl.close();
    });
}
draft();
