import { notes } from "./keyboard.js";

export function choose(choices) {
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

function pentascaleKeys (key = 'C4', major = true) {
    const start = notes.indexOf(key);
    if (start < 0) {
        throw new Error('Unknown note: ', key);
    }
    if (start > notes.length - 7) {
        throw new Error('Not enough notes to build pentascale: ' + key);
    }
    const index = major ? [0, 2, 4, 5, 7] : [0, 2, 3, 5, 7];

    return index.map(i => notes[i + start]);
}

export function pentascale ({ key = 'C4', major = true, lengths = ['', '', '*2'], coda = true} ) {
    const keys = pentascaleKeys(key, major);
    const lens = keys.map(() => choose(lengths));
    const symbols = keys.map((key, i) => key + lens[i]);

    const out = [];

    for (const note of keys) {
        const len = choose(lengths) === '*2' ? 2 : 1;
        out.push({ note, len, delay: len });
    }
    for (const note of keys.reverse().slice(1)) {
        const len = choose(lengths) === '*2' ? 2 : 1;
        out.push({ note, len, delay: len });
    }

    if (coda) {
        out.push({delay: 1});
        out.push({ note: keys[0], len: 2});
        out.push({ note: keys[2], len: 2});
        out.push({ note: keys[4], len: 2});
    }

    return out;
}

export function toscore (simple) {
    let len = 1;
    if (simple.endsWith('*1')) {
        simple = simple.slice(0, simple.length - 2);
    } else if (simple.endsWith('*2')) {
        len = 2;
        simple = simple.slice(0, simple.length - 2);
    }
    if (!notes.includes(simple)) {
        throw new Error('Failed to parse ' + simple);
    }

    return {
        note: simple,
        len,
        delay: len,
    };
}