import VisitorError from './visitorerror';
function hasOnlyOneParam(arrowFunctionExp) {
  if (arrowFunctionExp.params.length !== 1)
    throw new VisitorError(
      'Arrow Function Expressions must have exactly one argument'
    );
}
function isValidOrderBody(arrowFunctionExp) {
  if (arrowFunctionExp.body.type !== 'MemberExpression')
    throw new VisitorError(
      'The body of an order expression must be a Member Expression'
    );
}
function isValidSelectBody(arrowFunctionExp) {
  if (arrowFunctionExp.body.type !== 'ObjectExpression')
    throw new VisitorError(
      'The body of a select expression must be an Object Expression'
    );
}
function isValidWhereBody(arrowFunctionExp) {
  if (arrowFunctionExp.body.type !== 'LogicalExpression' &&
    arrowFunctionExp.body.type !== 'BinaryExpression')
    throw new VisitorError(
      'The body of a where expression must be a Logical or Binary Expression'
    );
}
function isValidMemberExpression(memberExp, id) {
  if (memberExp.object.type === 'Identifier' &&
    memberExp.object.name !== id)
    throw new VisitorError(
      'The Member Expression identifier must be the one of the Arrow Funciton'
    );
}
function isValidObjectProperty(objectProp) {
  let validTypes = ['ObjectExpression', 'ArrayExpression', 'Identifier'];
  if (validTypes.indexOf(objectProp.value.type) === -1)
    throw new VisitorError(
      'The value of an Object Property must be of type ObjectExpression, ArrayExpression or Identifier'
    );
}
function isValidBinaryExpression(binaryExp) {
  let lhs = binaryExp.left.type;
  let rhs = binaryExp.right.type;
  if (lhs === 'MemberExpression' && rhs === 'Identifier' ||
    lhs === 'Identifier' && rhs === 'MemberExpression')
    return;
  throw new VisitorError(
    'A Binary Expression must have a Member Expression and an Identifier'
  );
}
function isValidLogicalExpression(logicalExp) {
  let validTypes = ['LogicalExpression', 'BinaryExpression'];
  let lhs = logicalExp.left.type;
  let rhs = logicalExp.right.type;
  if (validTypes.indexOf(lhs) === -1 || validTypes.indexOf(rhs) === -1)
    throw new VisitorError(
      'A Logical Expression can only contain Logical Expressions and Binary Expressions'
    );
}
function isInParentMeta(node, metaEntities) {
  let entities = node.entities;
  let property = node.name;
  let parent = entities[entities.length - 1];
  let parentMeta = metaEntities.filter(c =>
    c.entity.name === parent.name)[0].meta;
  if (!parentMeta.properties || !parentMeta.properties[property])
    throw new VisitorError(
      `${property} is not in its class metadata`
    );
}
function hasRelationData(propMeta) {
  if (!propMeta.hasOne && !propMeta.hasMany)
    throw new VisitorError(
      'Cannot create a join whith a property that has no relation metadata'
    );
}

export const check = {
  hasOnlyOneParam: hasOnlyOneParam,
  isValidOrderBody: isValidOrderBody,
  isValidSelectBody: isValidSelectBody,
  isValidWhereBody: isValidWhereBody,
  isValidMemberExpression: isValidMemberExpression,
  isValidObjectProperty: isValidObjectProperty,
  isValidBinaryExpression: isValidBinaryExpression,
  isValidLogicalExpression: isValidLogicalExpression,
  isInParentMeta: isInParentMeta,
  hasRelationData: hasRelationData
};


