var moment = require('moment');
var _ = require('lodash');

module.exports = {
    "rating": {
        "paramName": "rating",
        "type": "range",
        "defaultValue": 3,
        "validate" : inRangeValidator,
        "config": {
            "min": 1,
            "max": 5,
            "step:": 1
        }
    },
    "adultsCount": {
        "paramName": "adultsCount",
        "type": "range",
        "defaultValue": 1,
        "validate" : inRangeValidator,
        "config":
        {
            "options": function() {
                return _.range(this.config.min, this.config.max);
            },
            "min": 1,
            "max": 5
        }
    },
    "childrenCount": {
        "paramName": "childrenCount",
        "type": "range",
        "defaultValue": 0,
        "config":
        {
            "options": function() {
                return _.range(this.config.min, this.config.max);
            },
            "min": 0,
            "max": 4
        }
    },
    "childrenDates": {
        "paramName": "childrenDates",
        "type": "date",
        "defaultValue": [],
        "isArray": true,
        "config": {
            "min": function () {
                return  moment(Date.now()).subtract(14, 'years').toDate();
            }
        }
    },
    "duration": {
        "paramName": "duration",
        "type": "option",
        "defaultValue": "7-14",
        "config": {
            "options": [
                "1-3",
                "4-5",
                "6-8",
                "7-14",
                "9-12",
                "13-15"
            ]
        }
    },
    "departureDate": {
        "paramName": "departureDate",
        "type": "date",
        "validate": minDateValidator,
        "config": {
            "min": function () {
                var date = new Date();
                date.setUTCHours(0,0,0,0);
                return date;
            }
        }
    },
    "returnDate": {
        "paramName": "returnDate",
        "type": "date",
        "deps": ["departureDate", "duration"],
        "beforeValidate": function (value) {
            return value.getTime() < this.getConfig().min.getTime() ? this.getConfig().min : value;
        },
        "validate": minDateValidator,
        "config": {
            "min": function (departureDate, duration) {
                var minDays = duration.getValue().split('-')[0];
                return moment(departureDate.getValue()).add(minDays, 'days').toDate();
            }
        }
    },
    "destinations": {
        "paramName": "destinations",
        "defaultValue": ['LNZ'],
        "type": "option",
        "isArray": true,
        "beforeValidate": function (value) {
            return value;
        },
        "config": { //TODO: !important bug with default value
            "options": [
                "AT", [
                    "AT-ALL", [
                        "GRZ",
                        "INN",
                        "KLU",
                        "LNZ",
                        "SZG",
                        "VIE"
                    ]
                ]
            ]
        }
    }
};

function inRangeValidator(value) {
    var invalid = false;
    if (value < this.getConfig().min) {
        this.addError(this.name + ' should be greater than ' + this.getConfig().min);
        invalid = true;
    } if (value > this.getConfig().max) {
        this.addError(this.name + ' should be smaller than ' + this.getConfig().max);
        invalid = true;
    }
    return invalid;
}

function minDateValidator(value) {
    var min = this.getConfig().min;
    if (value.getTime() < min.getTime()) {
        this.addError(this.name + ' should be greater than ' + moment(min).format('YYYY-MM-DD'));
        return false;
    }
    return true;
}