import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header.jsx';
import DateSelector from '../common/DateSelector.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';
import { h0 } from '../common/fp';

import CitySelector from '../common/CitySelector.jsx';
// 从acctions中取出，在dispatch中修改
import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
} from './actions';
function App(props) {
    // 触发此函数后header组件即使无更新也会重新渲染，为了避免这种情况，引入useCallback
    // 其第二个参数无内容便不会触发重新渲染
    const onBack = useCallback(() => {
        window.history.back();
    }, []);
    // 从下面的connect中取出from,to,dispatch
    const {
        from,
        to,
        dispatch,
        // citySelector所需要的初始值
        isCitySelectorVisible,
        isLoadingCityData,
        cityData,
        departDate,
        isDateSelectorVisible,
        highSpeed,
    } = props;
    // // start
    // // 减少渲染，故也要用useCallback包裹
    // const doExchangeFromTo = useCallback(() => {
    //     dispatch(exchangeFromTo());
    // }, []);
    // const doShowCitySelector = useCallback(m => {
    //     dispatch(showCitySelector(m));
    // }, []);
    // // end
    // 下面的代码等同于上面的代码,useMemo实现了批量useCallback的需求
    const cbs = useMemo(() => {
        return bindActionCreators(
            {
                exchangeFromTo,
                showCitySelector,
            },
            dispatch
        );
    }, []);
    // 选择城市后的回调函数
    const citySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData, // 将action中的此方法传递给子组件
                onSelect: setSelectedCity,
            },
            dispatch
        );
    }, []);
    // 选择日期组件
    const departDateCbs = useMemo(() => {
        return bindActionCreators(
            {
                onClick: showDateSelector,
            },
            dispatch
        );
    }, []);
    // 隐藏日期组件
    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        );
    }, []);
    // 选择日期
    const onSelectDate = useCallback(day => {
        if (!day) {
            return;
        }
        if (day < h0()) {
            return;
        }
        dispatch(setDepartDate(day));
        dispatch(hideDateSelector());
    }, []);
    // 只看动车的按钮切换
    const highSpeedCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggle: toggleHighSpeed,
            },
            dispatch
        );
    }, []);
    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} />
            </div>
            <form action="./query.html" className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate time={departDate} {...departDateCbs} />
                <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
                <Submit />
            </form>
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...citySelectorCbs}
            />
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect={onSelectDate}
            />
        </div>
    );
}
export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return {
            dispatch,
        };
    }
)(App);
