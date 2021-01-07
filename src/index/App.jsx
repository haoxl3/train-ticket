import React, { useCallback, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';
// 从acctions中取出，在dispatch中修改
import { exchangeFromTo, showCitySelector } from './actions';
function App(props) {
    // 触发此函数后header组件即使无更新也会重新渲染，为了避免这种情况，引入useCallback
    // 其第二个参数无内容便不会触发重新渲染
    const onBack = useCallback(() => {
        window.history.back();
    }, []);
    // 从下面的connect中取出from,to,dispatch
    const { from, to, dispatch } = props;
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
    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} />
            </div>
            <form className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate />
                <HighSpeed />
                <Submit />
            </form>
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
