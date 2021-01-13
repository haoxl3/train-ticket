import React, { useState, useMemo, useEffect, memo, useCallback } from 'react';
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
            <li className="city-li" key="title" data-cate={title}>
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

// 获得26个字母的数组
const alphabet = Array.from(new Array(26), (ele, index) => {
    return String.fromCharCode(65 + index);
});

const CityList = memo(function CityList(props) {
    // 从cityList中取出父组件传来的值或方法
    const { sections, onSelect, toAlpha } = props;
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
            <div className="city-index">
                {alphabet.map(alpha => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            onClick={toAlpha}
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
    toAlpha: PropTypes.func.isRequired,
};

// 搜索建议组件-点击列表
const SuggestItem = memo(function SuggestItem(props) {
    const { name, onClick } = props;
    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    );
});
SuggestItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

// 搜索建议组件-按文本框中的值进行搜索
const Suggest = memo(function Suggest(props) {
    const { searchKey, onSelect } = props;
    // 缓存搜索结果
    const [result, setResult] = useState([]);
    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then(res => res.json())
            .then(data => {
                const { result, searchKey: sKey } = data;
                if (sKey === searchKey) {
                    setResult(result);
                }
            });
    }, [searchKey]);
    // 搜索结果的展示：无搜索结果时展示搜索的词
    const fallBackResult = useMemo(() => {
        if (!result.length) {
            return [{ display: searchKey }];
        }
        return result;
    }, [result, searchKey]);
    return (
        <div className="city-suggest">
            <div className="city-suggest-ul">
                {fallBackResult.map(item => {
                    return (
                        <SuggestItem
                            key={item.display}
                            name={item.display}
                            onClick={onSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
});
Suggest.propTypes = {
    searchKey: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

// 点击右侧字母列表跳转相应的位置
const AlphaIndex = memo(function AlphaIndex(props) {
    const { alpha, onClick } = props;
    return (
        <i className="city-index-item" onClick={() => onClick(alpha)}>
            {alpha}
        </i>
    );
});
AlphaIndex.propTypes = {
    alpha: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
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

    // 点击字母跳转到相应的位置,useMemo(() => fn)等价于useCallback(fn)
    const toAlpha = useCallback(alpha => {
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
    }, []);

    const outputCitySections = () => {
        if (isLoading) {
            return <div>loading</div>;
        }

        if (cityData) {
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
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
            {Boolean(key) && (
                <Suggest searchKey={key} onSelect={key => onSelect(key)} />
            )}
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
