export function validateEntity(entity) {
    //TODO: see if entity corresponds with an user defined class??
    //TODO: i18n
    if (!entity)
        throw new Error('Invalid Entity');
}

export function validateContext(context) {
    //TODO: i18n
    checkContextExist(context);
    checkContextInheritsDbContext(context);  
}
function checkContextExist(context) {
    if (!context)
        throw new Error('Context does not exists');
}

function checkContextInheritsDbContext(context) {
    if (!context.prototype instanceof DbContext)
        throw new Error('Context does not inherit from DbContext');
}
