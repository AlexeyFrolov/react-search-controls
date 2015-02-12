var _ = require('lodash');
var moment = require('moment');

var Type = function (config, name, defaultValue, isArray, deps, beforeValidate, validator) {
    this.defaultValue = defaultValue;
    this.value = this.defaultValue;
    this.deps = deps || {};
    this.config = config || {};
    this.name = name;
    this.isArray = !!isArray;
    this.beforeValidate = beforeValidate;
    this.validator = validator;
    this.errors = [];
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
    } else if (!_.isUndefined(this.defaultValue) && this.defaultValue !== null) {
        val = this.defaultValue;
    } else if (!_.isUndefined(this.getConfig().min) && this.getConfig().min !== null) {
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
        defaultValue: this.defaultValue,
        name: this.name,
        type: this.type,
        isArray: this.isArray,
        errors: this.errors,
        fromString: this.fromString.bind(this),
        toString: this.toString.bind(this)
    };
};

Type.prototype.setValue = function(value) {
    if (this.beforeValidate) {
        if (!_.isArray(this.beforeValidate)) {
            beforeValidate = [this.beforeValidate];
        }
        value = _.reduce(beforeValidate, function (value, func) {
            if (!_.isFunction(func)) {
                throw new Error("beforeValidation handler should be function or array of functions in " + this.name);
            } else {
                return this._invokeWithDeps(func, value);
            }
        }, value, this);
    }
    /**
     * @TODO: deduplicate
     */
    this.value = value;
    this.errors = [];
    if (this.validator) {
        if (!_.isArray(this.validator)) {
            validator = [this.validator];
        }
        _.reduce(validator, function (value, func) {
            if (!_.isFunction(func)) {
                throw new Error("validate handler should be function or array of functions in " + this.name);
            } else {
                return this._invokeWithDeps(func, value);
            }
        }, value, this);
    }

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

Type.prototype.addError = function(error) {
    this.errors.push(error);
};

Type.prototype.getDeps = function() {
    return _.keys(this.deps);
};

Type.prototype.toString = function(value) {
    return value + '';
};

Type.prototype.fromString = function(string) {
    if (_.isNumber(this.defaultValue)) {
        return parseInt(string);
    }
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

function getArguments(func) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

function getTypeClass(name) {
    var types = {
        date: DateType,
        range: RangeType,
        option: OptionType
    };
    return types[name];
};

module.exports.getTypeClass = getTypeClass;