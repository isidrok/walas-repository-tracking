/*
Logic explanied:
    Can ADD:
        IF it IS NOT in the DB AND it IS NOT in the tracking OR
        It IS in the tracking and the last state IS DELETED
        -> CAN ADD
    Can UPDATE:
        IF It IS in the DB AND NOT in the tracking OR
        It IS in the tracking AND the last state is ADD OR UPDATE
        -> CAN UPDATE
    Can DELETE:
        IF It IS in the DB AND NOT in the tracking OR
        It IS in the tracking and the last state is ADD OR UPDATE
        -> CAN DELETE
    Can UNCHANGED:
        IF it is in the DB OR
        IF it is in tracking AND NOT already in UNCHANGED
        -> CAN UNCHANGED
*/
import { states } from './symbol';
function canAdd(entry, lastState) {
    return ((!isInDB(entry) && !lastState) || (lastState === states.delete));
}
function canUpdate(entry, lastState) {
    return ((isInDB(entry) && !lastState) || (lastState === states.add || lastState === states.update));
}
function canDelete(entry, lastState) {
    return ((isInDB(entry) && !lastState) || (lastState === states.add || lastState === states.update));
}
function canUnchanged(entry, lastState) {
    return (isInDB(entry) || (lastState && lastState != states.unchanged));
}
function isInDB(entry) {
    //return if entry is in query??
}
export { canAdd, canUpdate, canDelete, canUnchanged, isInDB };