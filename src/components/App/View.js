import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Date from 'components/Date';
import Rooms from 'components/Rooms';
import Time from 'components/Time';
import Chart from 'components/Chart';
import Form from 'components/Form';

import './style.scss';

export default class View extends Component {

    static propTypes = {
        show_form: PropTypes.bool
    }

    render() {

        return (
            <div className="container">
                <Header/>
                <main className="wrapper">
                    <section className="left-col">
                        <Date/>
                        <Rooms/>
                    </section>
                    <section className="right-col">
                        <Time/>
                        <Chart/>
                    </section>
                    {this.props.show_form ? <Form/> : null}
                </main>
            </div>
        );
    }
}
