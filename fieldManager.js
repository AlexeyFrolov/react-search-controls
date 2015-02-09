var _ = require('lodash');
var getTypeClass = require('./types').getTypeClass;

var FieldManager = function (params) {
  this.normalizeParams = function (params) {
    _.forOwn(params, function (param) {
      if (!_.isArray(param.deps)) {
        param.deps = [];
      }
    });
  };

  this.getTypes = function (params) {
    var result = {};
    var getType = function (paramName) {
      var deps;
      var type;
      if (result[paramName]) {
        return result[paramName];
      } else {
        param = params[paramName];
        if (param.deps.length > 0) {
          deps = _.reduce(param.deps, function (acc, dep) {
            acc[dep] = getType(dep);
            return acc;
          }, {});
        }
        type = getTypeClass(param.type);
        if (deps) {

        }
        result[paramName] = new type(param.config, param.paramName, param.defaultValue, param.isArray, deps, param.beforeValidate, param.validate);
        return result[paramName];
      }
    };
    _.each(_.keys(params), function (paramName) {
          getType(paramName);
        });
    return result;
  };

  this.bindControl = function (control, param) {
    var props = {};
    if (!param) {
      props.fields = this.getAllProps();
      props.change = this.change.bind(this);
      props.startTransaction = this.startTransaction.bind(this);
      props.flushTransaction = this.flushTransaction.bind(this);
      props.cancelTransaction = this.cancelTransaction.bind(this);
      props.isInTransaction = this.isInTransaction.bind(this);
      this.controls.push(control);
      control.setProps(props);
      return null;
    }
    if (_.isUndefined(this.getParam(param))) {
      throw new Error('There is no parameter ' + param + ' you want to bind control to');
    }
    props = this.getProps(param);
    control.setProps(props); // Uses react setProp.
    this.controls.push(control);

  };

  this.changeParam = function(param) {
    return function (value) {
      this.change(param, value);
    }.bind(this);
  };

  this.change = function (param, value) {
    if (_.isFunction(value)) {
      value = value(this.getParam(param).getValue());
    }
    else if (value === null) {
      value = this.getParam(param).defaultValue;
    }
    this.getParam(param).setValue(value);
    _.each(this.getParams(), function(field) { // @TODO: here we have a field for optimization
      if (field.getDeps().indexOf(param) > -1) {
        field.setValue(field.getValue());
      }
    }, this);
    this.updateControls();
  };

  this.updateControls = function () {
    _.each(this.controls, function (control) {
      if (control.isMultiControl()) {
        control.setProps({fields: this.getAllProps()});
      } else {
        control.setProps(this.getParam(control.props.name).getProps()); // Uses react setProp.
      }
    }, this);
  };

  this.isInTransaction = function () {
    return this.inTransaction;
  };

  this.startTransaction = function () {
    this.inTransaction = true;
    this.transactParams = this.cloneParams(this.params);
    this.updateControls();
  };

  this.flushTransaction = function () {
    this.inTransaction = false;
    this.params = this.cloneParams(this.transactParams);
    this.updateControls();
  };

  this.cancelTransaction = function () {
    this.inTransaction = false;
    this.transactParams = {};
    this.updateControls();
  };

  this.cloneParams = function (curParams) {
    var newParams = this.getTypes(params);
    _.forOwn(curParams, function (field, name) {
      newParams[name].value = _.cloneDeep(field.value);
      newParams[name].errors = _.cloneDeep(field.errors);
      }, this);
    return newParams;
  };

  this.getProps = function (param) {
    return _.assign({'change': this.changeParam(param).bind(this)}, this.getParam(param).getProps());
  };

  this.getAllProps = function () {
    return _.mapValues(this.getParams(), function (p, name) {
      return this.getProps(name);
    }, this);
  };

  this.getParam = function (paramName) {
    return this.getParams()[paramName];
  };

  this.getParams = function () {
    if (this.inTransaction) {
      return this.transactParams;
    }
    return this.params;
  };

  this.normalizeParams(params);
  this.params = this.getTypes(params);
  this.transactParams = {};
  this.controls = [];
  this.inTransaction = false;
};

function getArguments(func) {
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
    result = [];
  return result;
}

module.exports = FieldManager;