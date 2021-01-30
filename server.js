const express = require('express');
const {
  getFieldValueInData,
  successsfulValidationResponse,
  failedValidationResponse,
  errorResponse,
} = require('./helpers');
const { validate } = require('./middlewares');

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

server.all('*',
  (req, res) => {
    errorResponse(res, 'Resource not available.', 404);
  });

server.use((err, req, res, next) => { console.log(err); errorResponse(res, 'Invalid JSON payload pasopopsed.'); });

module.exports = server;
