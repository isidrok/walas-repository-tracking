import { STATES } from './states';
export class Tracking {
    constructor() {
        this.entries = [];
    }
    get entries() {
        return this.entries;
    }
    reset(){
        this.entries = [];
    }
    addEntry(entry) {
        if (entry.state === STATES.ADD) {
            if (this.isInTracking(entry))
                throw new Error('Entry is already in the tracking');
        }
        else {
            if (!this.IsInTracking(entry))
                throw new Error('Entry is not yet in the tracking')
            changeAllEntriesWithId(this.Id(entry), entry.state);
        }
        this.entries.push(entry);
    }
    isInTracking(entry) {
        this.entries.some(_entry => {
            return this.haveSameId(this.Id(entry), this.Id(_entry));
        });
    }
    changeAllEntriesWithId(id, state) {
        this.entries = this.entries.map(entry => {
            entry.state = isSameId(id, this.Id(entry)) ? state : entry.state;
        });
    }
    isSameId(id1, id2) {
        let keys1 = Object.keys(id1);
        let keys2 = Object.keys(id2);
        let result = true;
        if (keys1.length != keys2.length) return false;
        keys1.forEach(key => {
            if (id2[key] != id1[key]) result = false;
        });
        return result;
    }
    Id(entry) {
        return entry.entity.id;
    }
}