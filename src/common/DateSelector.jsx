import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Header from './Header';
import { h0 } from '../common/fp';
import './DateSelector.css';

// 日期组件
function Day(props) {
    const { day, onSelect } = props;
    // 如果没有日期，显示一个样式
    if (!day) {
        return <td className="null"></td>;
    }
    const classes = [];
    const now = h0();
    // 如果日期小于今天，则日期不可点击
    if (day < now) {
        classes.push('disabled');
    }
    // 如果当前日期为周六日，则添加相应的样式
    if ([6, 0].includes(new Date(day).getDay())) {
        classes.push('weekend');
    }
    // 如果当前是今天，则显示今天
    const dateString = now === day ? '今天' : new Date(day).getDate();

    return (
        <td onClick={() => onSelect(day)} className={classnames(classes)}>
            {dateString}
        </td>
    );
}
Day.propTypes = {
    day: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

// 周组件
function Week(props) {
    const { days, onSelect } = props;
    return (
        <tr className="date-table-days">
            {days.map((day, idx) => {
                return <Day key={idx} day={day} onSelect={onSelect} />;
            })}
        </tr>
    );
}
Week.propTypes = {
    days: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

// 月组件
function Month(props) {
    debugger;
    // onSelect以后要透传给week子组件
    const { startingTimeInMonth, onSelect } = props;
    // 获取传入的月份的每一天
    const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);
    let days = [];
    while (currentDay.getMonth() === startDay.getMonth()) {
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }

    // 月份之前的日期补空，如当前月第一天为周三，则前2天要为空,getDay为星期0-6，日为0
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null)
        .concat(days);
    // 获取月份的最后一天
    const lastDay = new Date(days[days.length - 1]);
    // 月份之后未满的日期补空,周日补0，周一补6=7-1
    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    );

    // 7天为一组渲染一行,获取每周
    const weeks = [];
    for (let row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);
    }
    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="date-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, idx) => {
                    return <Week key={idx} days={week} onSelect={onSelect} />;
                })}
            </tbody>
        </table>
    );
}
Month.propTypes = {
    startingTimeInMonth: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
    const { show, onSelect, onBack } = props;
    // 获取当前月的第一天
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(1);
    // 获取最近三个月
    const monthSequence = [now.getTime()];
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack} />
            <div className="date-selector-tables">
                {monthSequence.map(month => {
                    return (
                        <Month
                            key={month}
                            onSelect={onSelect}
                            startingTimeInMonth={month}
                        />
                    );
                })}
            </div>
        </div>
    );
}
DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
