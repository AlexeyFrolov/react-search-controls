var React = require('react');
var _ = require('lodash');

var Stars = React.createClass({

    isMultiControl: function () {
        return false;
    },

    //componentDidUpdate: function () {
    //    $('.glyphicon-star-empty').hover(function () {
    //        var prev = $(this).prevUntil('.glyphicon-star').add($(this));
    //        prev.addClass('glyphicon-star');
    //        prev.removeClass('glyphicon-star-empty');
    //    }, function () {
    //        $(this).prev().addClass('glyphicon-star-empty');
    //        $(this).prev().removeClass('glyphicon-star');
    //    })
    //},

    _handleChange: function(value) {
        this.props.change(parseInt(value));
    },

    render: function() {
        if (!this.props.config) {
            return <div />;
        }
        var min = this.props.config.min;
        var max = this.props.config.max;
        var value = this.props.value;
        return (
            <div className="container">
                <div className="row">
                {_.range(1, max + 1).map(function(key) {
                    var className = 'glyphicon';
                    if (key > value) {
                        className += ' glyphicon-star-empty';
                    } else {
                        className += ' glyphicon-star';
                    }
                    return (<span
                        key={key}
                        onClick={this._handleChange.bind(this, key)}
                        style={{display: 'inline-block', fontSize: '2em'}}
                        className={className}/>)
                }.bind(this))}
                </div>
            </div>
        );
    }
});

module.exports = Stars;