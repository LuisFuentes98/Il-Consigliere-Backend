let chai = require('chai');
let chaiHttp = require('chai-http');
var assert = require('assert');

const { expect } = require('chai');
let should = chai.should();
require('dotenv').config();

chai.use(chaiHttp);

describe('Basic Mocha String Test', function () {
 it('should return number of charachters in a string', function () {
        assert.equal("Hello".length, 5);
    });
 it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
        //throw {myError:'throwing error to fail test'}
    });
});