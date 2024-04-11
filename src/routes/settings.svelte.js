
class Settings {
    _key = $state('C4');
    _major = $state(true);
    _numNotes = $state(4);
    _voice = $state('triangle');

    constructor () {
        const saved = localStorage.getItem('settings');
        if (saved) {
            const { key, major, numNotes, voice = 'triangle' } = JSON.parse(saved);
            this._key = key;
            this._major = major;
            this._numNotes = numNotes;
            this._voice = voice;
        }
    }

    save () {
        localStorage.setItem('settings', JSON.stringify({
            key: this.key,
            major: this.major,
            numNotes: this._numNotes,
            voice: this._voice,
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
}

export const settings = new Settings();
