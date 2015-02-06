var React = require('react');

var departureWidget = React.createClass({

    isMultiControl: function () {
        return false;
    },

    componentDidMount: function () {
        var datePicker = $('#' + this.props.param).datepicker();
        datePicker.on("changeDate", function (e) {
            if (e.date.getTime() === this.props.value.getTime()) {
                return;
            }
            this.props.change(e.date);
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

        datePicker.datepicker('setDate', this.props.value);
    },


    render: function() {
        return (
            <div className="container">
                <div className="row">
                    <div className='col-sm-6'>
                        <div className="form-group">
                            <div className='input-group date' >
                                <input type='text' className="form-control" id={this.props.param} />
                                <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = departureWidget;