import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export default class Button extends Component {

    static propTypes = {
        color: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func,
        isIcon: PropTypes.bool,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        isIcon: false
    }

    render() {
        const buttonClassNames = classNames(
            this.props.className,
            'button',
            {'button--icon': this.props.isIcon},
            {'button--disabled': this.props.disabled},
            this.props.color ? `button--${this.props.color}` : ''
        );

        return (
            <button className={buttonClassNames} onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}
