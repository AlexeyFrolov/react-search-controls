var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var DatePicker = require('./datePicker.jsx');
var Dropdown = require('./dropdown.jsx');

var TravelPeriodFlyout = React.createClass({
    mixins: [OverlayMixin],

    isMultiControl: function () {
        return true;
    },
    getInitialState: function () {
        return {
            isModalOpen: false
        };
    },

    _open: function () {
        this.setState({
            isModalOpen: true
        });
        this.props.startTransaction();
    },

    _cancel: function () {
        this.setState({
            isModalOpen: false
        });
        this.props.cancelTransaction();
    },

    _ok: function () {
        this.setState({
            isModalOpen: false
        });
        this.props.flushTransaction();
    },

    render: function () {
        return (
            <Button onClick={this._open} bsStyle="primary">Launch</Button>
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