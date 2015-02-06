var React = require('react');
var _ = require('lodash');

var Destinations = React.createClass({

    isMultiControl: function () {
        return false;
    },

    _handleChange: function (e) {
        this.props.change(function (value) {
            if (e.target.checked) {
                value.push(e.target.value);
            } else {
                var index = value.indexOf(e.target.value);
                if (index > -1) {
                    value.splice(index, 1);
                }
            }
            return value;
        });
    },

    render: function() {
        if (!this.props.config) {
            return <div />;
        }
        var options = this.props.config.options;
        var value = this.props.value;
        var getTree = function (options) {
            return _.map(options, function(option) {
                if (!_.isArray(option)) {
                    var checked = (value.indexOf(option) > -1);
                    return (
                        <li key={option}>
                            <label>
                                <input checked={checked} value={option} type="checkbox" onChange={this._handleChange} />
                            {option}
                            </label>
                        </li>)
                } else {
                    return (
                        <ul>{getTree(option)}</ul>
                    )
                }
            }, this);
        }.bind(this);

        return (
            <div>
                <ul>
            {getTree(options)}
                </ul>
            </div>
        );
    }
});

module.exports = Destinations;