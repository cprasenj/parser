var inputFile = process.argv[2];
var grammar = require('./grammar.js');
var actionables = require('./actionable.js').actionables;
var fs = require('fs');
var _ = require('lodash');
var util = require('./util.js').util;
var stringUtil = require('util');

var actions = {
  'drinks' : 'DRINKABLE',
  'eats' : 'EDIBLE'
}

var messages = {
    'ACTIONABLE': {
      true : function() {
          return 'success';
      },
      false : function(action, actionable) {
          return stringUtil.format("%s can not be performed on %s", action, actionable);
      }
    }
}

var readFile = function(fileName) {
  return fs.readFileSync(fileName).toString();
}

var splitFile = function(content) {
  return _.dropRight(content.split('\n'), 1);
}

var parseInput = function(sentences) {
  return sentences.map(function(sentence) {
    return grammar.parse(sentence);
  });
}

var isValidAction = function(action, actionable) {
  return actionable[actions[action]];
}

var verifyChild = function(node) {
  var collectedObject = node.reduce(function(result, child) {
    return _.mergeWith(result, child, function(val1, val2) {
      return _.flatten([val1, val2]);
    });
  });
  var zipedObject = _.zipObject(collectedObject['header'], collectedObject['child']);
  var isValidActionTaken = isValidAction(zipedObject['ACTION'], zipedObject['ACTIONABLE']);
  return {
    'node' : node,
    'isValid' : Boolean(isValidActionTaken),
    'message' : util.evalNestedValue(messages, ['ACTIONABLE', Boolean(isValidActionTaken)])(zipedObject['ACTION'], _.valuesIn(zipedObject['ACTIONABLE']))
  };
}

var semanticCheck = function(parseTree) {
  return parseTree.map(function(node) {
    return _.flowRight(verifyChild, util.evalNestedValue)(node, ['child']);
  })
}

var check = function(inputFile) {
  var parseTree = _.flowRight(parseInput, splitFile, readFile)(inputFile);
  var semanticChecked = semanticCheck(parseTree);
  return semanticChecked;
}

var semanticChecker = function(inputFile) {
  var semanticChecked = check(inputFile);
  var semanticErrors = semanticChecked.filter(function(aCheckedNode) {
    return !aCheckedNode['isValid'];
  })
  return _.first(semanticErrors)['message'] || 'success';
}

exports.semanticChecker = semanticChecker;
console.log(semanticChecker(inputFile))
