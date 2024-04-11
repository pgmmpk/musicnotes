
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
    C0: new KeySound(16.35),
    d0: new KeySound(17.32),
    D0: new KeySound(18.35),
    e0: new KeySound(19.45),
    E0: new KeySound(20.60),
    F0: new KeySound(21.83),
    g0: new KeySound(23.12),
    G0: new KeySound(24.50),
    a0: new KeySound(25.96),
    A0: new KeySound(27.50),
    b0: new KeySound(29.14),
    B0: new KeySound(30.87),

    C1: new KeySound(32.70),
    d1: new KeySound(34.65),
    D1: new KeySound(36.71),
    e1: new KeySound(38.89),
    E1: new KeySound(41.20),
    F1: new KeySound(43.65),
    g1: new KeySound(46.25),
    G1: new KeySound(49.00),
    a1: new KeySound(51.91),
    A1: new KeySound(55.00),
    b1: new KeySound(58.27),
    B1: new KeySound(61.74),

    C2: new KeySound(65.41),
    d2: new KeySound(69.30),
    D2: new KeySound(73.42),
    e2: new KeySound(77.78),
    E2: new KeySound(82.41),
    F2: new KeySound(87.31),
    g2: new KeySound(92.50),
    G2: new KeySound(98.00),
    a2: new KeySound(103.83),
    A2: new KeySound(110.00),
    b2: new KeySound(116.56),
    B2: new KeySound(123.47),

    C3: new KeySound(130.81),
    d3: new KeySound(138.59),
    D3: new KeySound(146.83),
    e3: new KeySound(155.56),
    E3: new KeySound(164.81),
    F3: new KeySound(174.61),
    g3: new KeySound(185.00),
    G3: new KeySound(196.00),
    a3: new KeySound(207.65),
    A3: new KeySound(220.00),
    b3: new KeySound(233.08),
    B3: new KeySound(246.94),

    C4: new KeySound(261.63),
    d4: new KeySound(277.18),
    D4: new KeySound(293.66),
    e4: new KeySound(311.13),
    E4: new KeySound(329.63),
    F4: new KeySound(349.23),
    g4: new KeySound(369.99),
    G4: new KeySound(392.00),
    a4: new KeySound(415.30),
    A4: new KeySound(440.00),
    b4: new KeySound(466.16),
    B4: new KeySound(493.88),
    
    C5: new KeySound(523.25),
    d5: new KeySound(554.37),
    D5: new KeySound(587.33),
    e5: new KeySound(622.25),
    E5: new KeySound(659.26),   

    F5: new KeySound(698.46),
    g5: new KeySound(739.99),
    G5: new KeySound(783.99),
    a5: new KeySound(830.61),
    A5: new KeySound(880.00),
    b5: new KeySound(932.33),
    B5: new KeySound(987.77),

    C6: new KeySound(1046.50),
    d6: new KeySound(1108.73),
    D6: new KeySound(1174.66),
    e6: new KeySound(1244.51),
    E6: new KeySound(1318.51),
    F6: new KeySound(1396.91),
    g6: new KeySound(1479.98),
    G6: new KeySound(1567.98),
    a6: new KeySound(1661.22),
    A6: new KeySound(1760.00),
    b6: new KeySound(1864.66),
    B6: new KeySound(1975.53),

    C7: new KeySound(2093.00),
    d7: new KeySound(2217.46),
    D7: new KeySound(2349.32),
    e7: new KeySound(2489.02),
    E7: new KeySound(2437.02),
    F7: new KeySound(2793.83),
    g7: new KeySound(2959.96),
    G7: new KeySound(3135.96),
    a7: new KeySound(3322.44),
    A7: new KeySound(3520.00),
    b7: new KeySound(3729.31),
    B7: new KeySound(3951.07),

    C8: new KeySound(4186.01),
    d8: new KeySound(4434.92),
    D8: new KeySound(4698.64),
    e8: new KeySound(4978.03),
};


export function init (bus) {
    const releases = [];
    for (const [key, sound] of Object.entries(keyboard)) {
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
