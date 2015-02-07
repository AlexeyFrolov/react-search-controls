var React = require('react');

var Dropdown = React.createClass({

    isMultiControl: function () {
        return false;
    },

    componentDidMount: function () {
        var datePicker = $('#' + this.props.param).datepicker();
        datePicker.on("changeDate", function (e) {
            var date = new Date(e.date.getTime() - e.date.getTimezoneOffset() * 60 * 1000);
            if (date.getTime() === this.props.value.getTime()) {
                return;
            }
            this.props.change(date);
        }.bind(this));
    },

    componentWillUnmount: function () {
        var datePicker = $('#' + this.props.param);
        datePicker.datepicker().off("changeDate");
    },

    componentDidUpdate: function() {
        var datePicker = $('#' + this.props.param).datepicker({
                startDate: this.props.min
            }
        );
        console.log(this.props.value);
        var date = new Date(this.props.value.getTime() + this.props.value.getTimezoneOffset() * 60 * 1000);
        datePicker.datepicker('setDate', date);
    },


    render: function() {
        return (
            <div className="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
                    Dropdown
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
                    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
                </ul>
            </div>
        );
    }
});

module.exports = Dropdown;