import { STATES } from './states';
export class StateManager {
    constructor() {
        this._entries = [];
    }
    get entries() {
        return this._entries;
    }
    reset() {
        this._entries = [];
    }
    addEntry(entry) {
        if (entry.state === STATES.ADD && this._isInEntries(entry))
            this._changeEntriesWithId(entry);
        else if (entry.state !== STATES.ADD)
            this._changeEntriesStateWithId(entry.entity.id, entry.state);
        this._entries.push(entry);
    }
    _isInEntries(thisEntry) {
        this._entries.some(entry => {
            return this._haveSameId(thisEntry.entity.id, entry.entity.id);
        });
    }
    _changeEntriesStateWithId(id, state) {
        this._entries = this._entries.map(entry => {
            entry.state = this._isSameId(id, entry.entity.id) ? state : entry.state;
        });
    }
    _changeEntriesWithId(newEntry) {
        this._entries = this._entries.map(entry => {
            entry = this._isSameId(newEntry.entity.id, entry.entity.id) ? newEntry : entry;
        });
    }
    _isSameId(id1, id2) {
        let keys1 = Object.keys(id1);
        let keys2 = Object.keys(id2);
        if (keys1.length != keys2.length) return false;
        let filterLength = keys1.filter(key => { return id2[key] != id1[key]; }).length;
        return keys1.leght === filterLength;
    }
}