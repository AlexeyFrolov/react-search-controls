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

        var errors = this.props.fields.adultsCount.errors.concat(this.props.fields.childrenCount.errors);
        var errorsMessage;
        if (errors.length) {
            errorsMessage = 'Errors: ' + errors.length;
        } else {
            errorsMessage = '';
        }

        var title = adultsCount + " adults, " + childrenCount + " children";
        return (
            <div>
            <Button onClick={this._open} bsStyle="primary">{title}</Button>
                <span className="error">{errorsMessage}</span>
            </div>
        );
    },

    // This is called by the `OverlayMixin` when this component
    // is mounted or updated and the return value is appended to the body.
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        var adultsCount =  this.props.fields.adultsCount;
        var childrenCount =  this.props.fields.childrenCount;
        var childrenDates = this.props.fields.childrenDates;

        var errors = adultsCount.errors.concat(childrenCount.errors).concat(childrenDates.errors).map(function(error, key) {
            return <div className="error" key={key}>{error}</div>
        });

        return (
            <Modal title="Travellers" onRequestHide={this._cancel}>
                <div className="modal-body">
                    <label>Adults:
                        <Dropdown param="adultsCount" {...adultsCount} />
                    </label>
                    <label>Children:
                        <Dropdown   param="childrenCount"
                                    {...childrenCount}
                                    change={this._changeChildrenCount.bind(this)} />
                    </label>
                    <label> ChildrenDates:
                {_.range(0, childrenCount.value).map(function (key) {
                    var value = childrenDates.value[key] || childrenDates.config.min;
                    return <DatePicker
                        {...childrenDates}
                        key={key}
                        name={childrenDates.name + key}
                        value={value}
                        change={this._changeChildrenDate.bind(this, key)} />
                }.bind(this))}
                    </label>
                {errors}
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