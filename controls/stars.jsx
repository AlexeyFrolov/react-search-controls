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
                <ul className="rating rating-widget">
                {_.range(1, max + 1).map(function(key) {
                    var className = 'rating--item icon icon-glass';
                    if (key > value) {
                        className += '';
                    } else {
                        className += ' is-active';
                    }
                    return (<li
                        key={key}
                        onClick={this._handleChange.bind(this, key)}
                        style={{display: 'inline-block', fontSize: '2em'}}
                        className={className}/>)
                }.bind(this))}
                </ul>
            </div>
        );
    }
});

module.exports = Stars;