var _ = require('lodash');
var util = require('util');
var moment = require('moment');


var Type = function (config, defaultValue, isArray, deps, beforeValidate, validator) {
  this.defaultValue = defaultValue;
  this.deps = deps || {};
  this.config = config || {};
  this.isArray = !!isArray;
  this.beforeValidate = beforeValidate;
  this.validator = validator;
};

Type.prototype.getConfig = function () {
  var config = _.clone(this.config);
  _.forOwn(config, function (param, name) {
    if (_.isFunction(param)) {
      config[name] = this._invokeWithDeps(param);
    } else {
      config[name] = param;
    }
  }, this);

  return config;
};

Type.prototype.getValue = function() {
  var val = null;
  if (this.value) {
    val = this.value;
  } else if (this.defaultValue) {
    val = this.defaultValue;
  } else if (this.getConfig().min) {
    val = this.getConfig().min;
  } else if (this.isArray) {
    return [];
  } else {
    val = null;
  }
  return _.cloneDeep(val);
};

Type.prototype.getProps = function() {
  return {
    config: this.getConfig(),
    value: this.getValue(),
    type: this.type,
    isArray: this.isArray,
    fromString: this.fromString.bind(this),
    toString: this.toString.bind(this)
  };
};

Type.prototype.setValue = function(value) {
  this.value = value;
  if (this.beforeValidate) {
    if (!_.isArray(this.beforeValidate)) {
      this.beforeValidate = [this.beforeValidate];
    }
    value = _.reduce(this.beforeValidate, function (value, func) {
      if (!_.isFunction(func)) {
        throw new Error("beforeValidation handler should be function or array od functions");
      } else {
        return this._invokeWithDeps(func, value);
      }
    }, value, this);
  }

  this.value = value;
};

Type.prototype._invokeWithDeps = function(func) {
  var additionalArgs = _.toArray(arguments).slice(1);
  var args = _.map(getArguments(func).slice(additionalArgs.length), function (arg) {
    if (!this.deps[arg]) {
      throw new Error("Can't get config param for " + this.config.paramName);
    } else {
      return this.deps[arg];
    }
  }, this);
  return func.apply(this, additionalArgs.concat(args));
};

Type.prototype.getDeps = function() {
  return _.keys(this.deps);
};

Type.prototype.toString = function(value) {
  return value;
};

Type.prototype.fromString = function(string) {
  return string;
};



var DateType = function (config) {
  Type.apply(this, arguments);
  this.type = 'date';
};

DateType.prototype = _.create(Type.prototype, {
  constructor: DateType
});

DateType.prototype.toString = function (value) {
  var str = value.toISOString();
  return str.substring(0, str.indexOf('T'));
};

DateType.prototype.fromString = function (string) {
  var t = moment.utc(string).toDate();
  return t;
};



var RangeType = function (config) {
  Type.apply(this, arguments);
  this.type = 'range';
};

RangeType.prototype = _.create(Type.prototype, {
  constructor: RangeType
});

var OptionType = function (config) {
  Type.apply(this, arguments);
  this.type = 'option';
};

OptionType.prototype = _.create(Type.prototype, {
  constructor: OptionType

});


var getTypeClass = function (name) {
  var types = {
    date: DateType,
    range: RangeType,
    option: OptionType
  };
  return types[name];
};


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
        result[paramName] = new type(param.config, param.defaultValue, param.isArray, deps, param.beforeValidate, param.validate);
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
      control.setProps(props);
      this.controls.push(control);
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
        control.setProps(this.getParam(control.props.param).getProps()); // Uses react setProp.
      }
    }, this);
  };

  this.isInTransaction = function () {
    return this.inTransaction;
  };

  this.startTransaction = function () {
    this.inTransaction = true;
    this.transactParams = _.clone(this.params);
  };

  this.flushTransaction = function () {
    this.inTransaction = false;
    this.params = this.transactParams;
    this.updateControls();
  };

  this.cancelTransaction = function () {
    this.inTransaction = false;
    this.transactParams = {};
    this.updateControls();
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