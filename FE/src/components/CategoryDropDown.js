import { useState } from "react";
import './style/CategoryDropDown.css';

function CategoryDropDown(props) {
    let [isDrop1, setDrop1] = useState(false);
    let [isDrop2, setDrop2] = useState(false);

    const menuItems1 = ['OUTER', 'TOP', 'BOTTOM', 'SHOES', 'ETC']
    const menuItems2 = ['GIRL', 'BOY']

    return (
        <div style={{ display: 'flex', marginTop: '12px' }}>
            <div
                className={`CategoryDropDown-Box ${(props.isActive_1) ? '' : 'inactive'}`}
                onClick={() => { setDrop1(!isDrop1); console.log('드롭다운 : ', isDrop1, '둘다 :', isDrop1 && props.isActive_1) }}
            >
                <div style={{ fontWeight: props.상위카테고리 ? 'NotoSansKR-Medium' : 'NotoSansKR-Regular', color: props.상위카테고리 ? '#212120' : '#757575' }}>
                    {props.상위카테고리 || '카테고리 선택'}
                </div>
                {
                    (isDrop1 && props.isActive_1) ?
                        <div className='Category-DropDown-Container'>
                            {
                                menuItems1.map((list1, i) => (
                                    <div
                                        className='Category-DropDown-Menu'
                                        onClick={() => {
                                            props.상위카테고리변경(list1);
                                            setDrop1(false);
                                        }}>
                                        {list1}
                                    </div>
                                ))
                            }
                        </div> : null
                }
            </div>
            <img src='/img/Category_Arrow.svg' style={{ marginLeft: '30px', marginRight: '30px' }} />
            {
                (props.상위카테고리 != '') &&
                <div
                    className='CategoryDropDown-Box'
                    onClick={() => setDrop2(!isDrop2)}
                >
                    <div style={{ fontWeight: props.상위카테고리 ? 'NotoSansKR-Medium' : 'NotoSansKR-Regular', color: props.하위카테고리 ? '#212120' : '#757575' }}>
                        {props.하위카테고리 || '성별 선택'}
                    </div>
                    {
                        (isDrop2) &&
                        <div className='Category-DropDown-Container'>
                            {
                                menuItems2.map((list2, i) => (
                                    <div
                                        className='Category-DropDown-Menu'
                                        onClick={() => { props.하위카테고리변경(list2); setDrop2(false) }}
                                    >
                                        {list2}
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default CategoryDropDown;