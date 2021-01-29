const express = require('express');

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

function errorResponse(res, message) {
  return res.status(400).json({
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
    return errorResponse(res, 'condition in rule should be one of "eq", "neq", "gte", "gt", "contains".');
  } if (!isJSONObjectArrayString(data)) {
    return errorResponse(res, 'data should be either a valid JSON object, a valid array or a string.');
  } if (!checkRuleInData(rule.field, data)) {
    return errorResponse(res, `field ${rule.field} is missing from data.`);
  }
  return next();
}

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Yusuf Abdulkarim',
      github: '@haywhyze',
      email: 'haywhyze@gmail.com',
      mobile: '08031961496',
      twitter: '@haywhyze',
    },
  });
});

server.post('/validate-rule', validate, (req, res) => {
  const { rule, data } = req.body;

  const value = getFieldValueInData(rule.field, data);
  const conditions = {
    eq: (dataField, conditionValue) => dataField === conditionValue,
    neq: (dataField, conditionValue) => dataField !== conditionValue,
    gt: (dataField, conditionValue) => dataField > conditionValue,
    gte: (dataField, conditionValue) => dataField >= conditionValue,
    contains: (dataField, conditionValue) => dataField.includes(conditionValue),
  };

  return conditions[rule.condition](value, rule.condition_value)
    ? successsfulValidationResponse(res, rule, data)
    : failedValidationResponse(res, rule, data);
});

server.use((err, req, res, next) => errorResponse(res, 'Invalid JSON payload passed.'));

module.exports = server;
