const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));

export class Scheduler {
    constructor (scores, { beat = 750 }) {
        const timeline = [];
        let time = 0;
        for (const { delay, note, len } of scores) {
            if (note != undefined) {
                timeline.push({
                    what: 'pressed', time, note
                });
                timeline.push({
                    what: 'released', time: time + (len || 1) * beat, note
                });
            }
            if (delay !== undefined) {
                time += delay * beat;
            }
        }

        timeline.sort( (a, b) => {
            if (a.time < b.time) {
                return -1;
            } else if (a.time > b.time) {
                return 1;
            } else {
                if (a.what > b.what) {
                    return -1;
                } else if (a.what < b.what) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        this.timeline = timeline;
    }

    async play(bus) {
        if (this.timeline.length === 0) return;

        let now = this.timeline[0].time;
        const pressed = new Set();

        console.log(this.timeline)

        for ( const { what, time, note } of this.timeline) {
            if (time > now) {
                await sleep(time - now);
                now = time;
            }

            if (what === 'pressed') {
                if (pressed.has(note)) {
                    bus.dispatchEvent(note, 'released');
                    pressed.delete(note);
                }
                pressed.add(note);
                bus.dispatchEvent(note, 'pressed');
            } else {
                if (pressed.has(note)) {
                    bus.dispatchEvent(note, 'released');
                    pressed.delete(note);
                }
            }
        }

        for (const note of pressed) {
            bus.dispatchEvent(note, 'released');
        }
        pressed.clear();
    }
}