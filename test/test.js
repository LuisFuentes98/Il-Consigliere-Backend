let chai = require('chai');
let chaiHttp = require('chai-http');
var assert = require('assert');
let server = require('../server');
let should = chai.should();

describe('Basic Mocha String Test', function () {
 it('should return number of charachters in a string', function () {
        assert.equal("Hello".length, 5);
    });
 it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
        //throw {myError:'throwing error to fail test'}
    });
});

describe('UserControler Test', function () {
    describe('Prueba de envio de correo a asistentes a consejos', function(){

        it('devuelve status 200 si se envía el correo', function() {
            let book = {
                correo: "tetox11@gmail.com",
                permisos: "",
                id_tipo_convocado: "2"
            }
            chai.request(server)
              .post('/usuario/enviar_link')
              .send(data)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('json');                
                done();
              });
        });
    
    });
});