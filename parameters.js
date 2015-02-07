var qs = require('querystring');
var _ = require('lodash');

var Parameters = function () {
    this.initialized = false; // need send query values after bind
    this.dontPushState = false; // temporary fix
    this.props = {};
    window.onpopstate = function (e) {
        this.change(this._queryToValues(this.props.fields, window.location.search));
    }.bind(this);

    this.change = function (fieldValues) {
        _.forOwn(fieldValues, function (value, name) { // TODO: optimize
            this.dontPushState = true;
            this.props.change(name, value);
        }, this);
    };

    /**
     * Will handle all params
     * @param params
     */
    this.setProps = function (props) {
        var newProps = _.assign({}, this.props, props);
        if (!this.initialized) {
            this.props = newProps;
            this.initialized = true;
            this.change(this._queryToValues(newProps.fields, window.location.search));
            return null;
        }
        if (this.props.isInTransaction()) {
            return null;
        }
        if (this._propValuesToQuery(newProps.fields) === this._propValuesToQuery(this.props.fields)) {
            return null;
        }
        this.props = newProps;
        if (this.dontPushState) {
            this.dontPushState = false;
            return null;
        }
        console.debug('Will push');
        window.history.pushState(null, null, '?' + this._propValuesToQuery(this.props.fields));
    };

    this.isMultiControl = function () {
        return true;
    };

    /**
     * @TODO: touch only managed parameters
     * @param props
     * @param query
     * @returns {Object}
     */
    this._propValuesToQuery = function (props) {
        params = _.mapValues(props, function (fieldProp, paramName) {
            if (!_.isUndefined(fieldProp)) {
                if (fieldProp.isArray) {
                    return _.map(fieldProp.value, fieldProp.toString).join(',');
                } else {
                    return fieldProp.toString(fieldProp.value);
                }
            }
        });
        return qs.stringify(params);
    };

    /**
     * Applies query to field values
     * @param props
     * @param query
     * @returns {*|Object}
     * @private
     */
    this._queryToValues = function (props, query) {
        query = qs.parse(query.slice(1));
        return _.mapValues(props, function(fieldProp, paramName) {
            if (!_.isUndefined(query[paramName])) {
                // TODO: add support for dates etc.
                if (fieldProp.isArray) {
                    return _.map(query[paramName].split(','), fieldProp.fromString);
                } else {
                    return fieldProp.fromString(query[paramName]);
                }
            } else {
                return fieldProp.value;
            }
        });
    }
};


module.exports = Parameters;