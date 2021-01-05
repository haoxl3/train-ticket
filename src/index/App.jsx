import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';

function App(props) {
    // 触发此函数后header组件即使无更新也会重新渲染，为了避免这种情况，引入useCallback
    // 其第二个参数无内容便不会触发重新渲染
    const onBack = useCallback(() => {
        window.history.back();
    }, []);
    return (
        <div>
            <Header title="火车票" onBack={onBack} />
            <DepartDate />
            <HighSpeed />
            <Journey />
            <Submit />
        </div>
    );
}
export default connect(
    function mapStateToProps(state) {
        return {};
    },
    function mapDispatchToProps(dispatch) {
        return {};
    }
)(App);
