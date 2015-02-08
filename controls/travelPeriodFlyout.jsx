var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var DatePicker = require('./datePicker.jsx');
var Dropdown = require('./dropdown.jsx');
var FlyoutMixin = require('./mixins/flyoutMixin');
var moment = require('moment');

var TravelPeriodFlyout = React.createClass({
    mixins: [OverlayMixin, FlyoutMixin],

    isMultiControl: function () {
        return true;
    },
    getInitialState: function () {
        return {
            isModalOpen: false
        };
    },

    render: function () {
        if (!this.props.fields) {
            return <div />;
        }
        var duration =  this.props.fields.duration;
        var departureDate =  this.props.fields.departureDate;
        var returnDate =  this.props.fields.returnDate;
        var title = moment(departureDate.value).format('YYYY-MM-DD') + ' to ' + moment(returnDate.value).format('YYYY-MM-DD');
        return (
            <Button onClick={this._open} bsStyle="primary">{title}</Button>
        );
    },

    // This is called by the `OverlayMixin` when this component
    // is mounted or updated and the return value is appended to the body.
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <Modal title="Modal heading" onRequestHide={this._cancel}>
                <div className="modal-body">
                <Dropdown param="duration" {...this.props.fields.duration} />
                <DatePicker param="departureDate" {...this.props.fields.departureDate} />
                <DatePicker param="returnDate" {...this.props.fields.returnDate} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this._cancel}>Close</Button>
                    <Button onClick={this._ok}>OK</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = TravelPeriodFlyout;