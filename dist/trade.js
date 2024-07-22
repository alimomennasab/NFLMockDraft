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
const database_1 = require("./database");
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const draftCapital = yield (0, database_1.getDraftCapital)();
        console.log("Fetched draft capital data:", draftCapital);
        const tradeChart = yield (0, database_1.getTradeChart)();
        if (draftCapital.length === 0) {
            console.log("No draft capital data found.");
            rl.close();
            return;
        }
        console.log("Available teams:");
        draftCapital.forEach(team => console.log(team.team_name));
        rl.question('Select the first team: ', (team1Name) => {
            const team1 = draftCapital.find(team => team.team_name === team1Name);
            if (!team1) {
                console.log('Team not found');
                rl.close();
                return;
            }
            console.log(`${team1Name} draft capital:`, team1.picks);
            // remove first selected team from list of trade partners
            const availableTeamsForSecondSelection = draftCapital.filter(team => team.team_name !== team1Name);
            console.log("Available teams for the second selection:");
            availableTeamsForSecondSelection.forEach(team => console.log(team.team_name));
            rl.question('Choose the second team: ', (team2Name) => {
                const team2 = availableTeamsForSecondSelection.find(team => team.team_name === team2Name);
                if (!team2) {
                    console.log('Team not found');
                    rl.close();
                    return;
                }
                console.log(`${team2Name} draft capital:`, team2.picks);
                let team1Picks = [];
                let team2Picks = [];
                const choosePicks = (teamName, picks, callback) => {
                    console.log(`${teamName} picks:`, picks);
                    rl.question(`Choose a pick from ${teamName} (or type 'y' to finish): `, (pick) => {
                        if (pick === 'y') {
                            callback();
                            return;
                        }
                        const pickNumber = parseInt(pick);
                        if (!picks.includes(pickNumber)) {
                            console.log('Invalid pick');
                            choosePicks(teamName, picks, callback);
                            return;
                        }
                        picks.splice(picks.indexOf(pickNumber), 1);
                        if (teamName === team1Name) {
                            team1Picks.push(pickNumber);
                        }
                        else {
                            team2Picks.push(pickNumber);
                        }
                        choosePicks(teamName, picks, callback);
                    });
                };
                const evaluateTrade = () => {
                    const team1Value = team1Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
                    const team2Value = team2Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
                    const difference = Math.abs(team1Value - team2Value);
                    console.log(`${team1Name} gives up:`, team1Picks, `worth ${team1Value}`);
                    console.log(`${team2Name} gives up:`, team2Picks, `worth ${team2Value}`);
                    if (difference <= 100) {
                        console.log(`The trade between ${team1Name} and ${team2Name} is fair, and goes through.`);
                    }
                    else {
                        if (team1Value > team2Value) {
                            console.log(`${team2Name} needs to give up around ${difference} points of value`);
                        }
                        else {
                            console.log(`${team1Name} needs to give up around ${difference} points of value`);
                        }
                    }
                    rl.close();
                };
                choosePicks(team1Name, [...team1.picks], () => {
                    choosePicks(team2Name, [...team2.picks], evaluateTrade);
                });
            });
        });
    });
}
main();
