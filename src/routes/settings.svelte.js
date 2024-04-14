
class Settings {
    _key = $state('C4');
    _major = $state(true);
    _numNotes = $state(4);
    _voice = $state('piano');
    _fromPentascale = $state('A3');
    _toPentascale = $state('A5');

    constructor () {
        const saved = localStorage.getItem('settings');
        if (saved) {
            const { key, major, numNotes, voice = 'triangle', fromPentascale = 'A2', toPentascale = 'A5' } = JSON.parse(saved);
            this._key = key;
            this._major = major;
            this._numNotes = numNotes;
            this._voice = voice;
            this._fromPentascale = fromPentascale;
            this._toPentascale = toPentascale;
            console.log (saved, JSON.parse(saved))
        }
    }

    save () {
        localStorage.setItem('settings', JSON.stringify({
            key: this.key,
            major: this.major,
            numNotes: this._numNotes,
            voice: this._voice,
            fromPentascale: this._fromPentascale,
            toPentascale: this._toPentascale,
        }));
    }

    get key () { return this._key; }
    set key(value) {
        this._key = value;
        this.save();
    }

    get major () { return this._major; }
    set major(value) {
        this._major = value;
        this.save();
    }

    get numNotes () { return this._numNotes; }
    set numNotes(value) {
        this._numNotes = value;
        this.save();
    }

    get voice () { return this._voice; }
    set voice(value) {
        this._voice = value;
        this.save();
    }

    get fromPentascale () { return this._fromPentascale; }
    set fromPentascale (value) {
        this._fromPentascale = value;
        this.save();
    }

    get toPentascale () { return this._toPentascale; }
    set toPentascale (value) {
        this._toPentascale = value;
        this.save();
    }
}

export const settings = new Settings();
