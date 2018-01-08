import React, { Component } from 'react';
import Header from 'components/Header';
import Date from 'components/Date';
import Rooms from 'components/Rooms';
import Time from 'components/Time';
import Chart from 'components/Chart';
import Form from 'components/Form';

import './style.scss';

export default class App extends Component {

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
                    <Form/>
                </main>
            </div>
        );
    }
}
