import React, { memo, useCallback, useState, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import { TrainContext } from './context';
import dayjs from 'dayjs';
import './Candidate.css';

const Channel = memo(function Channel(props) {
    const { name, desc, type } = props;
    // trainNumber等参数如果从app.jsx传来层级太深，故可用context
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
    } = useContext(TrainContext);
    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('type', type)
            .toString();
    }, [type, trainNumber, departStation, arriveStation, departDate]);
    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    );
});
Channel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

const Seat = memo(function memo(props) {
    const {
        type,
        priceMsg,
        ticketsLeft,
        channels,
        expanded,
        onToggle,
        idx,
    } = props;
    return (
        <li>
            <div className="bar" onClick={() => onToggle(idx)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>￥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预订' : '收起'}</span>
                <span className="num">{ticketsLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0 }}
            >
                {channels.map(channel => {
                    return (
                        <Channel key={channel.name} type={type} {...channel} />
                    );
                })}
            </div>
        </li>
    );
});
Seat.propTypes = {
    type: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    ticketsLeft: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
};

const Candidate = memo(function Candidate(props) {
    const { tickets } = props;
    // 默认全不展开
    const [expandedIndex, setExpandedIndex] = useState(-1);
    const onToggle = useCallback(idx => {
        // 当点击的与当前行id一致时,当前行关闭，否则展开
        setExpandedIndex(idx === expandedIndex ? -1 : idx);
    });
    return (
        <div className="candidate">
            <ul>
                {tickets.map((ticket, idx) => {
                    return (
                        <Seat
                            idx={idx}
                            onToggle={onToggle}
                            expanded={expandedIndex === idx}
                            key={ticket.type}
                            {...ticket}
                        />
                    );
                })}
            </ul>
        </div>
    );
});
Candidate.propTypes = {
    tickets: PropTypes.array.isRequired,
};
export default Candidate;
