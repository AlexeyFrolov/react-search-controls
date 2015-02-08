var React = require('react');
var _ = require('lodash');

var ChangedParams = React.createClass({

    isMultiControl: function () {
        return true;
    },

    _restoreDefault: function(name) {
        this.props.change(name, null);
    },


    render: function() {
        if (!this.props.fields) {
            return <div />;
        }
        var changedFields = _.pick(this.props.fields, function(field) {
            return field.defaultValue && !_.isEqual(field.defaultValue, field.value);
        });
        return (
            <div>
            {_.map(_.toArray(changedFields), function (field) {
                return <span key={field.name} onClick={this._restoreDefault.bind(this, field.name)} className="glyphicon glyphicon-remove" aria-hidden="true">{field.name} </span>;
            }, this)}
            </div>);
    }
});

module.exports = ChangedParams;