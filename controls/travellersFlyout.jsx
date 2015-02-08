var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var DatePicker = require('./datePicker.jsx');
var Dropdown = require('./dropdown.jsx');
var FlyoutMixin = require('./mixins/flyoutMixin');
var moment = require('moment');
var _ = require('lodash');

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

    _changeChildrenDate: function (key, val) {
        this.props.change('childrenDates', function (value) {
            value[key] = val;
            return value;
        });
    },

    _changeChildrenCount: function (count) {
        this.props.change('childrenCount', count);
        this.props.change('childrenDates', function (value) {
            value = value.slice(0, count);
            return value;
        });
    },

    render: function () {
        if (!this.props.fields) {
            return <div />;
        }
        var adultsCount =  this.props.fields.adultsCount.value;
        var childrenCount =  this.props.fields.childrenCount.value;
        var title = adultsCount + " adults, " + childrenCount + " children";
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
            <Modal title="Travellers" onRequestHide={this._cancel}>
                <div className="modal-body">
                <Dropdown param="adultsCount" {...this.props.fields.adultsCount} />
                <Dropdown   param="childrenCount"
                            {...this.props.fields.childrenCount}
                            change={this._changeChildrenCount.bind(this)}
                            />
                {_.range(0, this.props.fields.childrenCount.value).map(function (key) {
                    var value = this.props.fields.childrenDates.value[key] || this.props.fields.childrenDates.config.min;
                    return <DatePicker
                        {...this.props.fields.childrenDates}
                        key={key}
                        name={this.props.fields.childrenDates.name + key}
                        value={value}
                        change={this._changeChildrenDate.bind(this, key)} />
                }.bind(this))}
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