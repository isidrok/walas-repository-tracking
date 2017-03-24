import { invalidConstructors } from './invalidconstructors';

export function validateEntity(entity) {
    if (!entity || invalidConstructors.indexOf(entity.constructor.name) > -1)
        throw new Error('Invalid Entity');
    //TODO: i18n
}
