import { states } from './utils/symbol';
import { canAdd, canUpdate, canDelete, canUnchanged, isInDB } from './utils/helpertracking';
export class Tracking {
    constructor() {
        this.entries = [];
    }
    get entries() {
        return this.entries;
    }
    addEntry(entry) {
        let lastEntry = getEntryById(getId(entry))
        let lastState = lastEntry ? lastEntry.state : undefined;
        let adders = {
            [states.add]: pushAddEntry,
            [states.update]: pushUpdateEntry,
            [states.delete]: pushDeleteEntry,
            [states.unchanged]: pushUnchangedEntry,
            'notFound': function () { throw new Error('Wrong state'); }
        };
        return adders[entry.state](entry, lastState) || adders['notFound']();
    }
    pushAddEntry(entry, lastState) {
        if (!canAdd(entry, lastState))
            throw new Error(`This entity cannot be added`);
        pushEntry(entry);
    }
    pushUpdateEntry(entry, lastState) {
        if (!canUpdate(entry, lastState))
            throw new Error(`This entity cannot be updated`);
        pushEntry(entry);
    }
    pushDeleteEntry(entry, lastState) {
        if (!canDelete(entry, lastState))
            throw new Error(`This entity cannot be deleted`);
        removeAllEntriesWithId(getId(entry));
        if (isInDB(entry)) pushEntry(entry);
    }
    pushUnchangedEntry(entry, lastState) {
        if (!canUnchanged(entry, lastState))
            throw new Error(`This entity cannot be set to unchanged`);
        removeAllEntriesWithId(getId(entry));
        pushEntry(entry);
    }
    getEntryById(id) {
        let result = null;
        this.entries.forEach(entry => {
            if (getId(entry) === id) result = entry;
        });
        return result;
    }
    removeAllEntriesWithId(id) {
        this.entries.filter(entry => {
            return getId(entry) != id;
        });
    }
    getId(entry) {
        return entry.entity.id;
    }
    pushEntry(entry) {
        this.entries.push(entry);
    }
}