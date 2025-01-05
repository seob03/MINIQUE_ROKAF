import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/Card.js';
import { BuyButton, DeleteButton } from '../components/Buttons';
import './style/Detail.css';

function Detail() {
  let [pageResult, setPageResult] = useState([]);
  let [pageLike, setPageLike] = useState(20);
  let isLoggedIn = useSelector((state) => {return state.isLoggedIn})
  let [isLiked, setIsLiked] = useState(false);
  let navigate = useNavigate();
  let { id } = useParams();
  console.log(id)
  // 페이지 결과를 상태로 관리

  useEffect(() => {
    // 비동기 함수 바로 호출
    const fetchData = async () => {
      const response = await fetch('/detail/' + id);
      const result = await response.json();
      setPageResult(result);
      setPageLike(result.like);
    };

    fetchData(); // 비동기 함수 호출
  }, [id]); // id가 변경될 때마다 호출


  function handleDelete() {
    fetch('/delete/' + id, 
    {
      method : 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if(data == true)
        alert("글이 정상적으로 삭제되었습니다.")
      else 
        alert("삭제 권한이 존재하지 않습니다.")
      navigate('/');
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }



  function HeartON() {
    setIsLiked(true);
    console.log('HeartON: ', pageLike)
    setPageLike(pageLike + 1)
    fetch(('/like/' + id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
      console.log('서버 응답:', data);
      })
      .catch(error => {
      console.error('fetch 오류:', error);
      });
    }

  function HeartOFF() {
    setIsLiked(false);
    console.log('HeartOFF: ', pageLike)
    setPageLike(pageLike - 1)
    fetch(('/unlike/' + id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
      console.log('서버 응답:', data);
      })
      .catch(error => {
      console.error('fetch 오류:', error);
      });
  }


  
  return (
    <div>
      <div className="Detail-Container">
        <div className="Detail-Image">
          {<img src={pageResult.productPhoto} className="Detail-Image cover"/>}
        </div>
        <div className="Detail-Content">
          <div className="Detail-FirstLine">
            <div className="Detail-Title">
            {pageResult.productName}
            </div>
            <div style={{flexGrow:1}}/>
            <div className="HeartBox">
              <div>
                { (isLiked) ? 
                <div onClick={()=>{HeartOFF()}} style={{fontSize: '20px', color: '#DB4437' , cursor: 'pointer'}}>♥</div> 
                : 
                <div onClick={()=>{HeartON()}} style={{fontSize: '20px', color: '#212120', cursor: 'pointer'}}>♡</div>
                }
              </div>
              <div>
                {pageLike}
              </div>
            </div>
          </div>
          <div className="Detail-Price">
            {pageResult.productPrice}원
          </div>
          <div className="Detail-Content">
            {pageResult.productDetailContent}
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              상태
            </div>
            <div className="Detail-Info-Content">
              {pageResult.productQuality}
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              아이 나이
            </div>
            <div className="Detail-Info-Content">
              {pageResult.childAge}
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              지역
            </div>
            <div className="Detail-Info-Content">
              경기도 평택시 송화리
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              배송비
            </div>
            <div className="Detail-Info-Content">
              3500원
            </div>
          </div>
          <div className="Detail-UserBox">
            <div>
              <div className="Detail-UserBox-Username">
                {pageResult.username}
              </div>
              <div className="Detail-UserBox-Userinfo">
                <div style={{color: '#FFBE64', marginRight: '8px'}}>
                  ★
                </div>
                <div>  
                  9.5
                </div>
                <div style={{marginLeft: '14px', marginRight:'14px'}}>
                  |
                </div>
                <div>
                  상품 개
                </div>
              </div>
            </div>
            <div className="Detail-UserBox-Follow">
              + 팔로우
            </div>
          </div>
          {(isLoggedIn) ? 
          <>
            <DeleteButton eventHandler={handleDelete}/>
            <Link to={'/edit/' + id}>수정</Link>
          </>
          : <BuyButton/> }
        </div>
      </div>

      <div style={{display: 'block', fontSize: '20px', fontFamily: 'NotoSansKR-Medium', marginTop: '180px'}}>
        같은 카테고리의 상품
      </div>
      <div class="Detail-Container">
        <Card photo={''}brand={'SainLaurant'} title={'가라1'} size={'62'} price={'1억'}/>
        <Card photo={''}brand={'Gucci'} title={'가라2'} size={'62'} price={'2억'}/>
        <Card photo={''}brand={'Tesla'} title={'가라3'} size={'62'} price={'3억'}/>
        <Card photo={''}brand={'Apple'} title={'가라4'} size={'62'} price={'4억'}/>
      </div>
    </div>
  );
}
export default Detail;