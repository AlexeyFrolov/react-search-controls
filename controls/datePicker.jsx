var React = require('react');

var DatePicker = React.createClass({

    isMultiControl: function () {
        return false;
    },

    componentDidMount: function () {
        this._updateDatePicker();
        var datePicker = $('#' + this.props.name).datepicker();
        datePicker.on("changeDate", function (e) {
            var date = new Date(e.date.getTime() - e.date.getTimezoneOffset() * 60 * 1000);
            if (date.getTime() === this.props.value.getTime()) {
                return;
            }
            this.props.change(date);
        }.bind(this));
    },

    componentWillUnmount: function () {
        var datePicker = $('#' + this.props.name);
        datePicker.datepicker().off("changeDate");
    },

    componentDidUpdate: function() {
        this._updateDatePicker();
    },

    _updateDatePicker: function() {
        var datePicker = $('#' + this.props.name).datepicker({
                startDate: this.props.config.min,
                format: 'yyyy-mm-dd'
            }
        );
        datePicker.datepicker('setStartDate', this.props.config.min);
        var date = new Date(this.props.value.getTime() + this.props.value.getTimezoneOffset() * 60 * 1000);
        datePicker.datepicker('setDate', date);
    },


    render: function() {
        return (
            <div className="form-group">
                <div className='input-group date' >
                    <input type='text' className="form-control" id={this.props.name} />
                    <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span>
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = DatePicker;