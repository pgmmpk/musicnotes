
let actx = null;

class KeySound {
    constructor(freq, type = 'triangle', decay = 4.0, stopDecay = 0.5) {
        // create oscillator, gain and compressor nodes
        this.freq = freq;
        this.type = type;
        this.decay = decay;
        this.stopDecay = stopDecay;
        this.osc = null;
        this.vol = null;
        this.isKeyDown = false;
    }

    pressed () {
        if (actx === null) {
            actx = new AudioContext();
        }

        if (this.isKeyDown || this.osc !== null || this.vol !== null) {
            return;
        }
        this.isKeyDown = true;
        const osc = actx.createOscillator();
        const vol = actx.createGain();

        // set the supplied values
        osc.frequency.value = this.freq;
        osc.type = this.type;

        // set the volume value so that we do not overload the destination
        // when multiple voices are played simmultaneously
        vol.gain.setValueAtTime(0.1, actx.currentTime);
        // Finally this schedules the fade out.
        vol.gain.exponentialRampToValueAtTime(
            0.0001,
            actx.currentTime + this.decay,
        );
        osc.connect(vol).connect(actx.destination);

        osc.start(actx.currentTime);
        osc.stop(actx.currentTime + this.decay);
        osc.addEventListener('ended', () => {
            if (this.osc === osc && this.vol === vol) {
                this.osc = null;
                this.vol = null;
            }
        });

        this.osc = osc;
        this.vol = vol;
    }

    released () {
        this.isKeyDown = false;
        if (this.osc === null || this.vol === null) {
            return;
        }
        this.vol.gain.setValueAtTime(Math.min(0.1, this.vol.gain.value), actx.currentTime);
        this.vol.gain.exponentialRampToValueAtTime(
            0.0001,
            actx.currentTime + this.stopDecay,
        );
        this.osc.stop(actx.currentTime + this.stopDecay);
        this.osc = null;
        this.vol = null;
    }

    process (what) {
        if (what === 'pressed') {
            this.pressed();
        } else {
            this.released();
        }
    }
}

export const keyboard = {
    C0: 16.35,
    d0: 17.32,
    D0: 18.35,
    e0: 19.45,
    E0: 20.60,
    F0: 21.83,
    g0: 23.12,
    G0: 24.50,
    a0: 25.96,
    A0: 27.50,
    b0: 29.14,
    B0: 30.87,

    C1: 32.70,
    d1: 34.65,
    D1: 36.71,
    e1: 38.89,
    E1: 41.20,
    F1: 43.65,
    g1: 46.25,
    G1: 49.00,
    a1: 51.91,
    A1: 55.00,
    b1: 58.27,
    B1: 61.74,

    C2: 65.41,
    d2: 69.30,
    D2: 73.42,
    e2: 77.78,
    E2: 82.41,
    F2: 87.31,
    g2: 92.50,
    G2: 98.00,
    a2: 103.83,
    A2: 110.00,
    b2: 116.56,
    B2: 123.47,

    C3: 130.81,
    d3: 138.59,
    D3: 146.83,
    e3: 155.56,
    E3: 164.81,
    F3: 174.61,
    g3: 185.00,
    G3: 196.00,
    a3: 207.65,
    A3: 220.00,
    b3: 233.08,
    B3: 246.94,

    C4: 261.63,
    d4: 277.18,
    D4: 293.66,
    e4: 311.13,
    E4: 329.63,
    F4: 349.23,
    g4: 369.99,
    G4: 392.00,
    a4: 415.30,
    A4: 440.00,
    b4: 466.16,
    B4: 493.88,
    
    C5: 523.25,
    d5: 554.37,
    D5: 587.33,
    e5: 622.25,
    E5: 659.26,   
    F5: 698.46,
    g5: 739.99,
    G5: 783.99,
    a5: 830.61,
    A5: 880.00,
    b5: 932.33,
    B5: 987.77,

    C6: 1046.50,
    d6: 1108.73,
    D6: 1174.66,
    e6: 1244.51,
    E6: 1318.51,
    F6: 1396.91,
    g6: 1479.98,
    G6: 1567.98,
    a6: 1661.22,
    A6: 1760.00,
    b6: 1864.66,
    B6: 1975.53,

    C7: 2093.00,
    d7: 2217.46,
    D7: 2349.32,
    e7: 2489.02,
    E7: 2437.02,
    F7: 2793.83,
    g7: 2959.96,
    G7: 3135.96,
    a7: 3322.44,
    A7: 3520.00,
    b7: 3729.31,
    B7: 3951.07,

    C8: 4186.01,
    d8: 4434.92,
    D8: 4698.64,
    e8: 4978.03,
};


export function init (bus, type = 'sine') {
    const releases = [];
    for (const [key, freq] of Object.entries(keyboard)) {
        const sound = new KeySound(freq, type);
        const release = bus.addEventListener(key, what => sound.process(what));
        releases.push(release);
    }

    return () => {
        for (const release of releases) {
            release();
        }
        releases.length = 0;
    }
}

export function findBounds (middleKey, count) {
    // utility that finds start and end white key given the middleKey and count of white keys to show
    const whiteKeys = Object.keys(keyboard).filter(key => key.toLowerCase() !== key);
    const middleIndex = whiteKeys.indexOf(middleKey.toUpperCase());
    if (middleIndex < 0) {
        throw new Error('Middle key not found: ' + middleKey);
    }

    let start = middleIndex - Math.floor(count / 2);
    let end = start + count;

    if (start < 0) {
        start = 0;
        end = Math.min(whiteKeys.length, start + count);
    }
    if (end > whiteKeys.length) {
        end = whiteKeys.length;
        start = Math.max(0, end - count);
    }

    return Array.from({length: (end - start)}).map((_, index) => {
        return whiteKeys[start + index];
    });
}
