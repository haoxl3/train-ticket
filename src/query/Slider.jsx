import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Slider.css';
import leftPad from 'left-pad';

const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged,
    } = props;
    // useRef与vue中的ref类似
    const startHandle = useRef();
    const endHandle = useRef();
    const lastStartX = useRef();
    const lastEndX = useRef();
    const range = useRef();
    const rangeWidth = useRef();
    // 创建缓冲区，设置滑块分为24份
    const [start, setStart] = useState(() => (currentStartHours / 24) * 100);
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100);
    const startPercent = useMemo(() => {
        if (start > 100) {
            return 100;
        }
        if (start < 0) {
            return 0;
        }
        return start;
    }, [start]);
    const endPercent = useMemo(() => {
        if (end > 100) {
            return 100;
        }
        if (end < 0) {
            return 0;
        }
        return end;
    }, [end]);
    // 设置滑块上显示的时间
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100);
    }, [startPercent]);
    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100);
    }, [endPercent]);
    const startText = useMemo(() => {
        return leftPad(startHours, 2, '0') + ':00';
    }, [startHours]);
    const endText = useMemo(() => {
        return leftPad(endHours, 2, '0') + ':00';
    }, [endHours]);
    useEffect(() => {
        // 获取滑块的长度
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        );
    }, []);
    useEffect(() => {
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        );
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        );
        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        );
        endHandle.current.addEventListener('touchmove', onEndTouchMove, false);
        // 第一个滑块的左侧与右侧滑动时记录开始坐标
        function onStartTouchBegin(e) {
            const touch = e.targetTouches[0];
            lastStartX.current = touch.pageX;
        }
        function onEndTouchBegin(e) {
            const touch = e.targetTouches[0];
            lastEndX.current = touch.pageX;
        }
        function onStartTouchMove(e) {
            const touch = e.targetTouches[0];
            const distance = touch.pageX - lastStartX.current;
            lastStartX.current = touch.pageX;
            // 将滑块移动的距离设置成移动的百分比
            setStart(start => start + (distance / rangeWidth.current) * 100);
        }
        function onEndTouchMove(e) {
            const touch = e.targetTouches[0];
            const distance = touch.pageX - lastEndX.current;
            lastEndX.current = touch.pageX;
            // 将滑块移动的距离设置成移动的百分比
            setEnd(end => end + (distance / rangeWidth.current) * 100);
        }
        // 解绑事件
        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            );
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            );
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            );
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            );
        };
    });
    // 向上一级回传开始与结束时间
    useEffect(() => {
        onStartChanged(startHours);
    }, [startHours]);
    useEffect(() => {
        onEndChanged(endHours);
    }, [endHours]);
    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider" ref={range}>
                    <div
                        className="slider-range"
                        style={{
                            left: startPercent + '%',
                            width: endPercent - startPercent + '%',
                        }}
                    ></div>
                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{
                            left: startPercent + '%',
                        }}
                    >
                        <span>{startText}</span>
                    </i>
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{
                            left: endPercent + '%',
                        }}
                    >
                        <span>{endText}</span>
                    </i>
                </div>
            </div>
        </div>
    );
});
Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
};

export default Slider;
