var app = require('../app');
var request = require('supertest');

test('test of the test', async (arg)=>{
    await request(app).get('/delete')
    .send({token : token})
    .expect(200)
    .expect({response : false, error : "Backend can't delete the user"})

    arg();
})