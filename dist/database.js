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
exports.getDraftOrder = getDraftOrder;
exports.getProspects = getProspects;
exports.getDraftCapital = getDraftCapital;
exports.getTradeChart = getTradeChart;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getDraftOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const draftOrderRecords = yield prisma.draft_order.findMany();
        const draftOrder = {};
        draftOrderRecords.forEach(record => {
            if (record.pick_number !== null && record.team_name !== null) {
                draftOrder[record.pick_number] = record.team_name;
            }
        });
        return draftOrder;
    });
}
function getProspects() {
    return __awaiter(this, void 0, void 0, function* () {
        const prospectsRecords = yield prisma.prospects.findMany();
        return prospectsRecords
            .filter(record => record.name !== null)
            .map(record => record.name);
    });
}
function getDraftCapital() {
    return __awaiter(this, void 0, void 0, function* () {
        const draftCapitalRecords = yield prisma.draft_capital.findMany();
        return draftCapitalRecords.map(record => ({
            team_name: record.team_name,
            picks: record.picks,
        }));
    });
}
function getTradeChart() {
    return __awaiter(this, void 0, void 0, function* () {
        const tradeChartRecords = yield prisma.trade_chart.findMany();
        const tradeChartDictionary = {};
        tradeChartRecords.forEach(record => {
            tradeChartDictionary[record.pick_number] = record.value;
        });
        return tradeChartDictionary;
    });
}
