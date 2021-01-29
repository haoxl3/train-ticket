import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import URI from 'urijs';
import dayjs from 'dayjs';

import Header from '../common/Header';
import Detail from '../common/Detail';
import Account from './Account';
import Choose from './Choose';
import Passengers from './Passengers';
import Ticket from './Ticket';
import './App.css';

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setSeatType,
    setDepartDate,
    setSearchParsed,
    fetchInitial, // 异步请求
} from './actions';

function App(props) {
    const {
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        durationStr,
        price,
        passengers,
        menu,
        isMenuVisible,
        searchParsed,
        dispatch,
    } = props;
    const onBack = useCallback(() => {
        window.history.back();
    });

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);
        const { trainNumber, dStation, aStation, type, date } = queries;
        dispatch(setDepartStation(dStation));
        dispatch(setArriveStation(aStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setSeatType(type));
        dispatch(setDepartDate(dayjs(date).valueOf()));
        dispatch(setSearchParsed(true));
    }, []);

    // 发起异步请求
    useEffect(() => {
        if (!searchParsed) {
            return;
        }
        const url = new URI('/rest/order')
            .setSearch('dStation', departStation)
            .setSearch('dStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
        dispatch(fetchInitial(url));
    }, [searchParsed, departStation, arriveStation, seatType, departDate]);

    if (!searchParsed) {
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title="订单填写" onBack={onBack} />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationStr={durationStr}
                >
                    <span
                        style={{ display: 'block' }}
                        className="train-icon"
                    ></span>
                </Detail>
            </div>
        </div>
    );
}
export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
