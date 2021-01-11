import React, { useState, useMemo, useEffect, memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './CitySelector.css';

// 城市列表
// memo针对是一个组件渲染是否重复执行，useMemo则定义一个函数逻辑是否重复执行；
const CityItem = memo(function CityItem(props) {
    const { name, onSelect } = props;
    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});
CityItem.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

// 城市块
const CitySection = memo(function CitySection(props) {
    const { title, cities = [], onSelect } = props;
    return (
        <ul className="city-ul">
            <li className="city-li" key="title">
                {title}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name}
                        name={city.name}
                        onSelect={onSelect}
                    />
                );
            })}
        </ul>
    );
});
CitySection.propTypes = {
    title: PropTypes.string.isRequired,
    cities: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
};

const CityList = memo(function CityList(props) {
    const { sections, onSelect } = props;
    return (
        <div className="city-list">
            <div className="city-cate">
                {sections.map(section => {
                    return (
                        <CitySection
                            key={section.title}
                            title={section.title}
                            cities={section.citys}
                            onSelect={onSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
});
CityList.propTypes = {
    sections: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const CitySelector = memo(function CitySelector(props) {
    // 调用父组件传来的onBack
    const {
        show,
        cityData,
        isLoading,
        onBack,
        fetchCityData,
        onSelect,
    } = props;
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

    const outputCitySections = () => {
        if (isLoading) {
            return <div>loading</div>;
        }

        if (cityData) {
            return (
                <CityList sections={cityData.cityList} onSelect={onSelect} />
            );
        }

        return <div>error</div>;
    };
    return (
        <div
            className={classnames('city-selector', {
                hidden: !show,
            })}
        >
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
            {outputCitySections()}
        </div>
    );
});
CitySelector.propTypes = {
    show: PropTypes.bool.isRequired,
    cityData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default CitySelector;
