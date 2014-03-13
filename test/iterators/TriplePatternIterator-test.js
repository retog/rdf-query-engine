/*! @license ©2014 Ruben Verborgh - Multimedia Lab / iMinds / Ghent University */

var TriplePatternIterator = require('../../lib/iterators/TriplePatternIterator');
var Stream = require('stream').Stream,
    SingleBindingsIterator = require('../../lib/iterators/SingleBindingsIterator'),
    FileFragmentsClient = require('../lib/FileFragmentsClient'),
    rdf = require('../../lib/rdf/RdfUtil');

var testClient = new FileFragmentsClient();

describe('TriplePatternIterator', function () {
  describe('The TriplePatternIterator module', function () {
    it('should be a function', function () {
      TriplePatternIterator.should.be.a('function');
    });

    it('should make TriplePatternIterator objects', function () {
      TriplePatternIterator().should.be.an.instanceof(TriplePatternIterator);
    });

    it('should be a TriplePatternIterator constructor', function () {
      new TriplePatternIterator().should.be.an.instanceof(TriplePatternIterator);
    });

    it('should make Stream objects', function () {
      TriplePatternIterator().should.be.an.instanceof(Stream);
    });

    it('should be a Stream constructor', function () {
      new TriplePatternIterator().should.be.an.instanceof(Stream);
    });
  });

  describe('A TriplePatternIterator for dbpedia:York ?p ?o', function () {
    var pattern = { subject: rdf.DBPEDIA + "York",
                    predicate: 'urn:var#p',
                    object: 'urn:var#o' };
    var iterator = new TriplePatternIterator(pattern, { fragmentsClient: testClient });
    SingleBindingsIterator({}).pipe(iterator);
    it('should be a stream of ?p/?o bindings', function (done) {
      var expectedBindings = testClient.getBindingsByPattern(pattern).map(function (binding) {
        return { bindings: { 'urn:var#p': binding.predicate, 'urn:var#o': binding.object } };
      });
      iterator.should.be.a.streamOf(expectedBindings, done);
    });
  });

  describe('A TriplePatternIterator for ?x a :Artist', function () {
    var pattern = { subject: 'urn:var#x',
                    predicate: rdf.RDF_TYPE,
                    object: rdf.DBPEDIAOWL + 'Artist' };
    var iterator = new TriplePatternIterator(pattern, { fragmentsClient: testClient });
    SingleBindingsIterator({}).pipe(iterator);
    it('should be a stream of ?x bindings', function (done) {
      var expectedBindings = testClient.getBindingsByPattern(pattern).map(function (binding) {
        return { bindings: { 'urn:var#x': binding.subject } };
      });
      iterator.should.be.a.streamOf(expectedBindings, done);
    });
  });
});