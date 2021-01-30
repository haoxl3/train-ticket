import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Passengers.css';

const Passenger = memo(function Passenger(props) {
    const {
        id,
        name,
        followAdult,
        ticketType,
        licenceNo,
        gender,
        birthday,
        onRemove,
        onUpdate,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
        followAdultName,
    } = props;
    const isAdult = ticketType === 'adult';
    return (
        <li className="passenger">
            <i className="delete" onClick={() => onRemove(id)}>
                -
            </i>
            <ol className="items">
                <li className="item">
                    <label className="label name">姓名</label>
                    <input
                        type="text"
                        className="input name"
                        placeholder="乘客姓名"
                        value={name}
                        onChange={e => onUpdate(id, { name: e.target.value })}
                    />
                    <label
                        className="ticket-type"
                        onClick={() => showTicketTypeMenu(id)}
                    >
                        {isAdult ? '成人票' : '儿童票'}
                    </label>
                </li>
                {isAdult && (
                    <li className="item">
                        <label className="label licenceNo">身份证</label>
                        <input
                            type="text"
                            className="input licenceNo"
                            placeholder="证件号码"
                            value={licenceNo}
                            onChange={e =>
                                onUpdate(id, { licenceNo: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item arrow">
                        <label className="label gender">性别</label>
                        <input
                            type="text"
                            className="input gender"
                            placeholder="请选择"
                            onClick={() => showGenderMenu(id)}
                            value={
                                gender === 'male'
                                    ? '男'
                                    : gender === 'female'
                                    ? '女'
                                    : ''
                            }
                            readOnly
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item">
                        <label className="label birthday">出生日期</label>
                        <input
                            type="text"
                            className="input birthday"
                            placeholder="如 19920601"
                            value={birthday}
                            onChange={e =>
                                onUpdate(id, { birthday: e.target.value })
                            }
                            readOnly
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item arrow">
                        <label className="label followAdult">同行成人</label>
                        <input
                            type="text"
                            className="input followAdult"
                            placeholder="请选择"
                            value={followAdultName}
                            onClick={() => showFollowAdultMenu(id)}
                            readOnly
                        />
                    </li>
                )}
            </ol>
        </li>
    );
});
Passenger.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    followAdult: PropTypes.number,
    ticketType: PropTypes.string.isRequired,
    licenceNo: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
    followAdultName: PropTypes.string,
};

const Passengers = memo(function Passengers(props) {
    const {
        passengers,
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props;

    const nameMap = useMemo(() => {
        // 根据id找到姓名
        const ret = {};
        for (const passenger of passengers) {
            ret[passenger.id] = passenger.name;
        }
        return ret;
    }, [passengers]);

    return (
        <div className="passengers">
            <ul>
                {passengers.map(passenger => {
                    return (
                        <Passenger
                            {...passenger}
                            onRemove={removePassenger}
                            onUpdate={updatePassenger}
                            showGenderMenu={showGenderMenu}
                            showFollowAdultMenu={showFollowAdultMenu}
                            showTicketTypeMenu={showTicketTypeMenu}
                            followAdultName={nameMap[passenger.followAdult]}
                            key={passenger.id}
                        />
                    );
                })}
            </ul>
            <section className="add">
                <div className="adult" onClick={createAdult}>
                    添加成人
                </div>
                <div className="child" onClick={createChild}>
                    添加儿童
                </div>
            </section>
        </div>
    );
});
Passengers.propTypes = {
    passengers: PropTypes.array.isRequired,
    createAdult: PropTypes.func.isRequired,
    createChild: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
};
export default Passengers;
