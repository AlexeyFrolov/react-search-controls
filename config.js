var moment = require('moment');
var _ = require('lodash');

module.exports = {
    //"rating": {
    //    "paramName": "rating",
    //    "type": "range",
    //    "defaultValue": "3",
    //    "config": {
    //        "min": 1,
    //        "max": 5,
    //        "step:": 1
    //    }
    //
    //},
    //"adults": {
    //    "paramName": "adults",
    //    "type": "range",
    //    "config":
    //    {
    //        "min": 1,
    //        "max": 9
    //    }
    //},
    //"children": {
    //    "paramName": "children",
    //    "type": "date",
    //    "isArray": true,
    //    "config": {
    //        "min": "now - 14Y"
    //    }
    //},
    "duration": {
        "paramName": "duration",
        "type": "option",
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
        "config": {
            "min": function () {
                return new Date();
            }
        }
    },
    "returnDate": {
        "paramName": "returnDate",
        "type": "date",
        "deps": ["departureDate"],
        "beforeValidate": function (value) {
            return value.getTime() < this.getConfig().min.getTime() ? this.getConfig().min : value;
        },
        "validate": function (departureDate) {

        },
        "config": {
            "min": function (departureDate) {
                return moment(departureDate.getValue()).add(1, 'week').toDate();
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