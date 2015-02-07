//require('node-jsx').install({extension: '.jsx'});
var React = require('react');
var config = require('./config');
var FieldManager = require('./fieldManager');
var Parameters = require('./parameters');

var parameters = new Parameters();

var fm = new FieldManager(config);

var departureWidget = React.render(React.createElement(require('./datePicker.jsx'), {param: "departureDate"}), document.getElementById('departureWidget'));
var returnWidget = React.render(React.createElement(require('./datePicker.jsx'), {param: "returnDate"}), document.getElementById('returnWidget'));

var destinations = React.render(React.createElement(require('./destinations.jsx'), {param: "destinations"}), document.getElementById('destinations'));

fm.bindControl(departureWidget, "departureDate");
fm.bindControl(returnWidget, "returnDate");

fm.bindControl(destinations, "destinations");
fm.bindControl(parameters);