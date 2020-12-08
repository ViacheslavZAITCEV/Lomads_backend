/* Autor: ZAITCEV

                   READ ME
**************************************************

1. avant d'execution les testes il faut installer:

npm install jest supertest

----------

2. ajouter/verifier au package.json les lignes des scriptes:
  "scripts": {
    "start": "node ./bin/www",
    "test" : "jest"
  }

----------

3. dans package.json verifier le dependecies ajouté:
    "jest": "^26.6.3",
    "supertest": "^6.0.1",

-----------


execution des testes: 

npm run test

**************************************************
*/

var app = require('../app');
var request = require('supertest');
var mongoose = require('mongoose');

var users = require('../models/users');


// test('test of the test', function(){
//     const somme = 5+2;
//     expect (somme).toBe(8);
// })



test('test route /users/delete', async (arg)=>{
    await request(app).get('/users/delete')
    .send({token : 0})
    .expect(200)
    .expect({response : false, error : "Backend can't delete the user"})

    arg();
});

describe('test route /users/sign-in', ()=> {
    test('wrong email : null', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : null})
        .expect(200)
        .expect({response : false, error : "email is null or undefined"})
    
        arg();
    }); 

    
    test('wrong email : undefined', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : undefined})
        .expect(200)
        .expect({response : false, error : "email is null or undefined"})
    
        arg();
    });


    test('wrong email : AlEX@PiLeHG', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : 'AlEX@PiLeHG'})
        .expect(200)
        .expect({response : false, error : "email does not exist"})
    
        arg();
    });


    test('good email : vo@gmail.fr', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : 'vo@gmail.fr'})
        .expect(200)
        .expect({response : true, error : "email does not exist"})
    
        arg();
    });
});