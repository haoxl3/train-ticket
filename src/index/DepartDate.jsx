import React, { useMemo } from 'react';
import './DepartDate.css';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { h0 } from '../common/fp';
export default function DepartDate(props) {
    const { time, onClick } = props;
    // 只获取日期，时分秒置0
    const h0OfDepart = h0(time);
    const departDate = new Date(h0OfDepart);
    // 优化，避免重复渲染
    const departDateString = useMemo(() => {
        return dayjs(h0OfDepart).format('YYYY-MM-DD');
    }, [h0OfDepart]);
    // 判断是否是今天
    const isToday = h0OfDepart === h0();
    // 星期
    const weekString =
        '周' +
        ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()] +
        (isToday ? '(今天)' : '');
    return (
        <div className="depart-date" onClick={onClick}>
            <input type="hidden" name="date" value={departDateString} />
            {departDateString}
            <span className="depart-week">{weekString}</span>
        </div>
    );
}
DepartDate.propTypes = {
    time: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};
