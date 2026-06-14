"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTransitions = removeTransitions;
function removeTransitions(flow, blocked) {
    const newFlow = {};
    for (const status in flow) {
        newFlow[status] = flow[status].filter(s => !blocked.includes(s));
    }
    return newFlow;
}
