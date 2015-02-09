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
            return !_.isUndefined(field.defaultValue) && !_.isEqual(field.defaultValue, field.value);
        });
        return (
        <div className="tagbar">
            {_.map(_.toArray(changedFields), function (field) {
            return  (
                <div key={field.name} href="#" className="tagbar--item">
                  {field.name}
                <a onClick={this._restoreDefault.bind(this, field.name)} className="icon icon-clear"></a>
                </div>
            );
            }, this)}
        </div>)
    }
});

module.exports = ChangedParams;