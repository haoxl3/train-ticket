import React, { memo } from 'react';
import './Submit.css';

// 无任何参数传递，故可用memo
export default memo(function Submit(props) {
    return (
        <div className="submit">
            <button type="submit" className="submit-button">
                搜索
            </button>
        </div>
    );
});
