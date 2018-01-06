import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        date: PropTypes.instanceOf(Date)
    }

    _renderLines = () => {
        const lines = [];

        for (let i = 0; i < 24; i++) {
            const date = this.props.date;
            const firstCondition = moment(date).isSame(new Date(), 'day');
            const secondCondition = date.getHours() === i;
            const position = date.getMinutes() * 1.1; // bc 1 minute === 1.1px (layout)
            const currentTimeBlock = (
                <div className="chart__item-time" style={{left: `${position}px`}}>
                    <div className="chart__item-current">{moment(date).format('HH:mm')}</div>
                </div>
            );

            lines.push(
                <div className="chart__lines-item" key={`line-${i}`}>
                    { (firstCondition && secondCondition) ? currentTimeBlock : null }
                </div>
            );
        }

        return lines;
    }

    render() {
        const lines = this._renderLines();

        return (
            <div className="chart">
                <div className="chart__lines">
                    {lines}
                </div>
            </div>
        );
    }
}
