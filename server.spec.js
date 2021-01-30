const request = require('supertest');
const server = require('./server.js');

describe('Rule Validation', () => {
  describe('HTTP GET "/', () => {
    it('should return a JSON object with my details', async (done) => {
      const expectedBody = {
        message: 'My Rule-Validation API',
        status: 'success',
        data: {
          name: 'Yusuf Abdulkarim',
          github: '@haywhyze',
          email: 'haywhyze@gmail.com',
          mobile: '08031961496',
          twitter: '@haywhyze',
        },
      };
      const response = await request(server).get('/');
      expect(response.body).toEqual(expectedBody);
      done();
    });
  });
  describe('HTTP POST "/validate-rule"', () => {
    it('Should return error when rule and data is missing', async (done) => {
      const response = await request(server).post('/validate-rule').send({
        json: 'Should return error',
      });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual([
        'rule is required.',
        'data is required.',
      ]);
      done();
    });
    it('Should return error when rule is missing', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('rule is required.');
      done();
    });
    it('Should return error when data is missing', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missions.count',
            condition: 'gte',
            condition_value: 30,
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('data is required.');
      done();
    });
    it('Should return error when rule is not valid object', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: 9,
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('rule should be an object.');
      done();
    });
    it('Should return error when field is missing in rule', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            condition: 'gte',
            condition_value: 30,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('field in rule is required.');
      done();
    });
    it('Should return error when condition is missing in rule', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missons.count',
            condition_value: 30,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('condition in rule is required.');
      done();
    });
    it('Should return error when condition_value is missing in rule', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missons.count',
            condition: 'gte',
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('condition_value in rule is required.');
      done();
    });
    it('Should return error when field in rule is nested more than two levels', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missons.count.minimum.value',
            condition: 'gte',
            condition_value: 30,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('field in rule should not contain nested objects more than two levels.');
      done();
    });
    it('Should return error when condition in rule is not one of acccepted values', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missons.count.minimum',
            condition: 'gtem',
            condition_value: 30,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: {
              count: 45,
              successful: 44,
              failed: 1,
            },
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('condition in rule should be one of [eq | neq | gte | gt | contains].');
      done();
    });
    it('Should return error when data is not of valid acccepted types', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missons.count.minimum',
            condition: 'gt',
            condition_value: 30,
          },
          data: true,
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('data should be either a valid JSON object, a valid array or a string.');
      done();
    });
    it('Should return error when invalid JSON is passed', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send('notJSON');
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('Invalid JSON payload passed.');
      done();
    });
    it('Should return error when field in rule is missing in data', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: '5',
            condition: 'contains',
            condition_value: 'rocinante',
          },
          data: ['The Nauvoo', 'The Razorback', 'The Roci', 'Tycho'],
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toEqual(null);
      expect(response.body.message).toEqual('field 5 is missing from data.');
      done();
    });
    it('Should pass validation when data in request is valid', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missions',
            condition: 'gte',
            condition_value: 30,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: 45,
          },
        });
      expect(response.status).toEqual(200);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('success');
      expect(response.body.data).toHaveProperty('validation');
      expect(response.body.message).toEqual('field missions successfully validated.');
      expect(response.body.data.validation).toEqual({
        error: false,
        field: 'missions',
        field_value: 45,
        condition: 'gte',
        condition_value: 30,
      });
      done();
    });
    it('Should fail validation when data in request is valid', async (done) => {
      const response = await request(server)
        .post('/validate-rule')
        .send({
          rule: {
            field: 'missions',
            condition: 'gte',
            condition_value: 78,
          },
          data: {
            name: 'James Holden',
            crew: 'Rocinante',
            age: 34,
            position: 'Captain',
            missions: 45,
          },
        });
      expect(response.status).toEqual(400);
      expect(response.type).toEqual('application/json');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      expect(response.body.status).toEqual('error');
      expect(response.body.data).toHaveProperty('validation');
      expect(response.body.message).toEqual('field missions failed validation.');
      expect(response.body.data.validation).toEqual({
        error: true,
        field: 'missions',
        field_value: 45,
        condition: 'gte',
        condition_value: 78,
      });
      done();
    });
  });
});
