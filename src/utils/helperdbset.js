import { invalidConstructors } from './invalidconstructors';

export function validateInstance(instance, entity) {
    if (!instance || instance.constructor.name !== entity.name)
        throw new Error(`Invalid Instance`);
    //TODO: i18n
}

export function validateContext(context) {
    if (!context || invalidConstructors.indexOf(context.constructor.name) > -1)
        throw new Error('Invalid Context');
    //TODO: i18n
}
