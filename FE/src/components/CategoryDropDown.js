import { useState } from "react";

function CategoryDropDown(props){
    let [isDrop1, setDrop1] = useState(false);
    let [isDrop2, setDrop2] = useState(false);

    const menuItems1=['GIRL', 'BOY'];
    const menuItems2=['OUTER', 'TOP', 'BOTTOM', 'SHOES', 'ETC']

    return(
        <div style={{display: 'flex', marginTop: '12px'}}>
            <div 
                className="CategoryDropDown-Box"
                onClick={()=>setDrop1(!isDrop1)}
            >
                {props.상위카테고리}
                {
                    (isDrop1 && props.isActive) &&
                    <div className='Category-DropDown-Container'>
                        {
                            menuItems1.map((list1, i) => (
                                <div 
                                    className='Category-DropDown-Menu'
                                    onClick={()=>{
                                        props.상위카테고리변경(list1); 
                                        setDrop1(false);
                                }}>
                                    {list1}
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
            <img src='/img/Category_Arrow.svg' style={{marginLeft: '44px', marginRight: '44px'}}/>
            {
                (props.상위카테고리 != '') &&
                <div 
                    className='CategoryDropDown-Box'
                    onClick={()=>setDrop2(!isDrop2)}
                >
                    ▼{props.하위카테고리}
                    {
                        (isDrop2) &&
                        <div className='Category-DropDown-Container'>
                        {
                            menuItems2.map((list2, i) => (
                                <div
                                    className='Category-DropDown-Menu'
                                    onClick={()=>{props.하위카테고리변경(list2); setDrop2(false)}}
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