var FlyoutMixin = {
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
    }
};

module.exports = FlyoutMixin;