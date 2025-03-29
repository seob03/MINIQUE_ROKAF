import { useState } from "react";
import './style/CategoryDropDown.css';

function DropDown(props) {
    let [isDrop1, setDrop1] = useState(false);

    return (
        <div style={{ display: 'flex', marginTop: '12px' }}>
            <div
                className="CategoryDropDown-Box"
                onClick={() => { setDrop1(!isDrop1) }}
            >
                <div style={{ fontWeight: props.상태 ? 'NotoSansKR-Medium' : 'NotoSansKR-Regular', color: props.상태 ? '#212120' : '#757575' }}>
                    {props.상태 ? `${props.상태}개월` : '선택하세요'}
                </div>
                {
                    (isDrop1) ?
                        <div className='Category-DropDown-Container'>
                            {Array.from({ length: 120 }, (_, i) => (
                                <div key={i + 1} value={i + 1}
                                    className="Category-DropDown-Menu"
                                    onClick={()=>{props.상태변경함수(i+1)}}
                                >
                                    {i + 1}개월
                                </div>
                            ))}
                        </div> : null
                }
            </div>
        </div>
    );
}

export default DropDown;