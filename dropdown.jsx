var React = require('react');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

var Dropdown = React.createClass({

    isMultiControl: function () {
        return false;
    },

    _handleChange: function(value) {
        this.props.change(value);
    },

    render: function() {
        if (!this.props.config) {
            return <div />;
        }
        var options = this.props.config.options;
        return (
            <div className="dropdown">
                <ButtonToolbar>
                    <DropdownButton
                        bsSize="medium"
                        title={this.props.value}
                        onSelect={this._handleChange}>
                    {options.map(function(option) {
                        return <MenuItem eventKey={option}>{option}</MenuItem>
                    })}
                    </DropdownButton>
                </ButtonToolbar>
            </div>
        );
    }
});

module.exports = Dropdown;