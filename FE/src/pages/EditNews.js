import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeIsOpen } from "../store/store.js";
import { ButtonMediumBlue, ButtonMediumGray } from '../components/Buttons';
import './style/EditNews.css';

function EditNews(){
    let [상품명, 상품명변경]=useState(''); 
    let [상품상세설명, 상품상세설명변경]=useState(''); 
    let [이미지, 이미지변경] = useState(null); 
    let [개월수정보, 개월수변경] = useState('');
    let [상품상태, 상품상태변경] = useState('');
    let [가격, 가격변경] = useState(''); 

    return(
        <div>
            <div className='Edit-Title-1'>
                상품 수정하기
            </div>
            <div>
                <div className="Edit-Title-2">
                    이미지 업로드
                </div>
                <div>
                <input type="file" accept="image/*" onChange={null} style={{marginBottom: '36px'}}/>
                {이미지 && <img src={이미지} alt="Preview" style={{ maxWidth: '200px', margin: '16px 0' }} />}
            </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품명
                </div>
                <input 
                className="Edit-Input-Title"
                onChange={(e) => {
                    상품명변경(e.target.value);
                }} 
                type="text"/>
                <div style={{
                    justifycontent: 'flex-end', 
                    marginLeft: '20px',
                    marginTop: '0.6rem'
                }}>
                    {상품명.length}/40
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품 상세 설명
                </div>
                <input 
                    className="Edit-Input-Content"
                    onChange={(e) => {
                        상품상세설명변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{
                    display: 'block',
                    marginLeft: '20px',
                    marginTop: '0.6rem'
                }}>
                    {상품상세설명.length}/200
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    아이 정보 입력
                </div>
                <input 
                    className="Edit-Input"
                    onChange={(e) => {
                        개월수변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    개월
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품 상태
                </div>
                <input 
                    className="Edit-Input"
                    onChange={(e) => {
                        상품상태변경(e.target.value);
                    }} 
                    type="text"
                />
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    카테고리
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    가격
                </div>
                <input 
                    className="Edit-Input-Price"
                    onChange={(e) => {
                        가격변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    원
                </div>
            </div>
            <div className="Edit-ButtonArea">
                <ButtonMediumBlue text={'수정완료'} eventHandler={null}/>
                <ButtonMediumGray text={'임시저장'} eventHandler={null}/>
            </div>
        </div>
    )
}

export default EditNews;