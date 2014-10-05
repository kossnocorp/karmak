var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require('sinon');
var chaiShallowDeepEqual = require('chai-shallow-deep-equal');

chai.use(sinonChai);
chai.use(chaiShallowDeepEqual);

global.expect = chai.expect;
global.sinon = sinon;

