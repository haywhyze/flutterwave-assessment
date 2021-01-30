function isJSONObject(obj) {
  try {
    const type = Object.prototype.toString.call(obj);
    return type === '[object Object]';
  } catch (err) {
    return false;
  }
}

function isJSONObjectArrayString(obj) {
  if (typeof obj === 'string'
  || Object.prototype.toString.call(obj) === '[object Array]') {
    return true;
  }
  try {
    const type = Object.prototype.toString.call(obj);
    return type === '[object Object]';
  } catch (err) {
    return false;
  }
}

function errorResponse(res, message, status = 400) {
  return res.status(status).json({
    message,
    status: 'error',
    data: null,
  });
}

function checkRuleInData(field, data) {
  return !!String(field)
    .split(/\.|\["|"\]/)
    .filter((e) => e)
    .reduce((a, b) => (a ? a[b] : null), data);
}

function getFieldValueInData(field, data) {
  return String(field)
    .split(/\.|\["|"\]/)
    .filter((e) => e)
    .reduce((a, b) => (a ? a[b] : null), data);
}

function successsfulValidationResponse(res, rule, data) {
  return res.status(200).json({
    message: `field ${rule.field} successfully validated.`,
    status: 'success',
    data: {
      validation: {
        error: false,
        field: rule.field,
        field_value: getFieldValueInData(rule.field, data),
        condition: rule.condition,
        condition_value: rule.condition_value,
      },
    },
  });
}

function failedValidationResponse(res, rule, data) {
  return res.status(400).json({
    message: `field ${rule.field} failed validation.`,
    status: 'error',
    data: {
      validation: {
        error: true,
        field: rule.field,
        field_value: getFieldValueInData(rule.field, data),
        condition: rule.condition,
        condition_value: rule.condition_value,
      },
    },
  });
}

module.exports = {
  isJSONObject,
  isJSONObjectArrayString,
  errorResponse,
  successsfulValidationResponse,
  failedValidationResponse,
  getFieldValueInData,
  checkRuleInData,
};
