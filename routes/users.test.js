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


    test('good email : a', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : 'slava@lacapsule.edu', password : 'S'})
        .expect(200)
        .expect( {
      response: true,
      token: 'LbKHA2EuRfAYFrWC5XNmJ0WbFhkujI2V',
      nom: 'La Capsule',
      prenom: 'Slava',
      avatar: 'https://res.cloudinary.com/dhtl1axxt/image/upload/v1607439849/h3aaxgvch2eydzoht3c4.png',
      ville: 'La Garenne Colombes',
      preferences: [
        {
          _id: '5fddf7ea3118840017543be4',
          cinema: true,
          theatre: true,
          exposition: true,
          concert: true,
          fantastique: true,
          scienceFiction: true,
          comedie: false,
          drame: false,
          spectacleMusical: false,
          contemporain: false,
          oneManShow: true,
          musiqueClassique: false,
          musiqueFrancaise: false,
          musiquePop: true,
          musiqueRock: true,
          beauxArts: false,
          histoireCivilisations: false
        }
      ],
      favoris: [ '5fce43f16697a656d4d4ea5b' ],
      sorties: [ '5fddf7a73118840017543be1' ],
      amis: [],
      confidentialite: true
    })
    
        arg();
    });
    test('good EMAIL in CAPS: A', async (arg)=>{
        await request(app).post('/users/sign-in')
        .send({email : 'slAvA@lacAPsule.edu', password : 'S'})
        .expect(200)
                .expect( {
      response: true,
      token: 'LbKHA2EuRfAYFrWC5XNmJ0WbFhkujI2V',
      nom: 'La Capsule',
      prenom: 'Slava',
      avatar: 'https://res.cloudinary.com/dhtl1axxt/image/upload/v1607439849/h3aaxgvch2eydzoht3c4.png',
      ville: 'La Garenne Colombes',
      preferences: [
        {
          _id: '5fddf7ea3118840017543be4',
          cinema: true,
          theatre: true,
          exposition: true,
          concert: true,
          fantastique: true,
          scienceFiction: true,
          comedie: false,
          drame: false,
          spectacleMusical: false,
          contemporain: false,
          oneManShow: true,
          musiqueClassique: false,
          musiqueFrancaise: false,
          musiquePop: true,
          musiqueRock: true,
          beauxArts: false,
          histoireCivilisations: false
        }
      ],
      favoris: [ '5fce43f16697a656d4d4ea5b' ],
      sorties: [ '5fddf7a73118840017543be1' ],
      amis: [],
      confidentialite: true
    })
    
        arg();
    });
});




describe('test route /users/sign-up', ()=> {

    test('wrong email : null', async (arg)=>{
        await request(app).post('/users/sign-up')
        .send({email : null})
        .expect(200)
        .expect({response : false, error : "email is null or undefined"})
    
        arg();
    }); 
    
    test('wrong email : undefined', async (arg)=>{
        await request(app).post('/users/sign-up')
        .send({email : undefined})
        .expect(200)
        .expect({response : false, error : "email is null or undefined"})
    
        arg();
    }); 
    
    test('wrong email : undefined', async (arg)=>{
        await request(app).post('/users/sign-up')
        .send({email : undefined})
        .expect(200)
        .expect({response : false, error : "email is null or undefined"})
    
        arg();
    }); 






});
