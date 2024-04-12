class Chooser {
    _choice = $state('ear-training');

    constructor () {
        const saved = localStorage.getItem('chooser');
        if (saved) {
            const { choice = 'triangle' } = JSON.parse(saved);
            this._choice = choice;
        }
    }

    save () {
        localStorage.setItem('chooser', JSON.stringify({
            choice: this._choice,
        }));
    }

    get choice () { return this._choice; }
    set choice(value) {
        this._choice = value;
        this.save();
    }
}

export const chooser = new Chooser();
