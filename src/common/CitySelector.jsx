import React, { useState, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './CitySelector.css';

export default function CitySelector(props) {
    // 调用父组件传来的onBack
    const { show, cityData, isLoading, onBack, fetchCityData } = props;
    // 从State中获取值
    const [searchKey, setSearchKey] = useState('');
    // input去除前后空格，无变化时不重新渲染
    const key = useMemo(() => searchKey.trim(), [searchKey]);
    // 异步请求是一个副作用，故用useEffect，将有变化时再做请求放第二个参数
    useEffect(() => {
        // 已经展示或有数据或正在加载中，则不请求新数据
        if (!show || cityData || isLoading) {
            return;
        }
        fetchCityData();
    }, [show, cityData, isLoading]);
    return (
        <div className={classnames('city-selector', { hidden: !show })}>
            <div className="city-search">
                <div className="search-back" onClick={() => onBack()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25, 13 16, 21 25, 29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                <i
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                    onClick={() => setSearchKey('')}
                >
                    &#xf063;
                </i>
            </div>
        </div>
    );
}
CitySelector.propTypes = {
    show: PropTypes.bool.isRequired,
    cityData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
};
