import { keyboard } from "./keyboard.js";

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

export function generate ( { num = 5, keys = ['C4', 'D4', 'D4', 'E4'], lengths = ['', '', '*2'] } = {}) {
    const score = new Array(num);

    for (let i = 0; i < num; i++) {
        score[i] = {
            note: choose(keys),
            len: choose(lengths),
        }
    }

    // ens and start on min/max keys
    score[0].note = choose([keys[0], keys[keys.length - 1]]);
    score[score.length - 1].note = choose([keys[0], keys[keys.length - 1]]);

    return score.map(({note, len}) => note + len);
}

const notes = new Set(['A', 'B', 'C', 'd', 'D', 'E', 'f', 'F', 'g', 'G'])
const position = new Set(['1', '2', '3', '4', '5', '6', '7'])

export function toscore (simple) {
    let len = 1;
    if (simple.endsWith('*1')) {
        simple = simple.slice(0, simple.length - 2);
    } else if (simple.endsWith('*2')) {
        len = 2;
        simple = simple.slice(0, simple.length - 2);
    }
    if (!Object.keys(keyboard).includes(simple)) {
        throw new Error('Failed to parse ' + simple);
    }

    return {
        note: simple,
        len,
        delay: len,
    };
}