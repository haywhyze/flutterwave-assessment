const {
  isJSONObject,
  isJSONObjectArrayString,
  checkRuleInData,
  errorResponse,
} = require('./helpers');

function validate(req, res, next) {
  const { rule, data } = req.body;
  if (!Object.keys(req.body).length) {
    return errorResponse(res, 'Invalid JSON payload passed.');
  } if (!rule && !data) {
    return errorResponse(res, ['rule is required.', 'data is required.']);
  } if (!rule) {
    return errorResponse(res, 'rule is required.');
  } if (!data) {
    return errorResponse(res, 'data is required.');
  } if (!isJSONObject(rule)) {
    return errorResponse(res, 'rule should be an object.');
  } if (!('field' in rule)) {
    return errorResponse(res, 'field in rule is required.');
  } if (!('condition' in rule)) {
    return errorResponse(res, 'condition in rule is required.');
  } if (!('condition_value' in rule)) {
    return errorResponse(res, 'condition_value in rule is required.');
  } if (String(rule.field).split(/\.|\["|"\]/).filter((e) => e).length > 3) {
    return errorResponse(res, 'field in rule should not contain nested objects more than two levels.');
  } if (!['eq', 'neq', 'gte', 'gt', 'contains'].includes(rule.condition)) {
    return errorResponse(res, 'condition in rule should be one of [eq | neq | gte | gt | contains].');
  } if (!isJSONObjectArrayString(data)) {
    return errorResponse(res, 'data should be either a valid JSON object, a valid array or a string.');
  } if (!checkRuleInData(rule.field, data)) {
    return errorResponse(res, `field ${rule.field} is missing from data.`);
  }
  return next();
}

module.exports = {
  validate,
};
