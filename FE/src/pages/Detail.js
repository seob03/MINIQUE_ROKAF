import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card.js';
import DetailSlider from "../components/DetailSlider.js";
import { ButtonMedium, WideButton, DeleteButtonHalf } from '../components/Buttons';
import { changeIsOpen } from "../store/store.js";
import './style/Detail.css';
import Swal from 'sweetalert2';

function Detail() {
  let [pageResult, setPageResult] = useState([]);
  let [pageLike, setPageLike] = useState(0);
  let isLoggedIn = useSelector((state) => { return state.isLoggedIn })
  let [isLiked, setIsLiked] = useState(false);
  let [whoamI, setWhoAmI] = useState('');
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { id } = useParams(); // 글 id (String)

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/productDetail/getUserInfo')
        .then((response) => response.json())
        .then((data) => {
          setWhoAmI(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
    } else {
      setWhoAmI(false)
    }
  }, [id])


  // 로그인 된 유저가 현재 게시글을 좋아요 누른 적이 있는지 추적
  useEffect(() => {
    // 로그인이 되어있어야 요청을 보냄, 안되어있으면 보내지 않고 초기값 false로 설정해버림
    if (isLoggedIn) {
      fetch('/isLikedPost/' + id)
        .then((response) => response.json())
        .then((data) => {
          console.log('좋아요 눌러져 있나요?:', data)
          setIsLiked(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setIsLiked(false)
    }
  }, [id])

  useEffect(() => {
    // 비동기 함수 바로 호출
    const fetchData = async () => {
      try {
        const response = await fetch('/productDetail/getPageInfo/' + id);
        const result = await response.json();
        setPageResult(result);
        setPageLike(result.like);
      } catch (error) {
        // 에러 처리
        console.error('데이터 가져오기 실패:', error)
      }
    }
    fetchData(); // 비동기 함수 호출
  }, [id]); // id가 변경될 때마다 호출

  function handleDelete() {
    Swal.fire({
      title: "글을 삭제하시겠습니까?",
      text: "삭제된 글은 복구되지 않습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네, 삭제합니다!",
      cancelButtonText: "아니요, 취소할래요!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/productDetail/delete/' + id, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === true) {
              Swal.fire({
                title: "삭제 완료!",
                text: "글이 정상적으로 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
              }).then(() => {
                navigate('/'); // 삭제 후 메인 페이지로 이동
              });
            } else {
              Swal.fire({
                title: "삭제 실패",
                text: "삭제 권한이 존재하지 않습니다.",
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            Swal.fire({
              title: "오류 발생!",
              text: "삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          });
      }
    });
  }




  function HeartON() {
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.')
      return
    }
    setIsLiked(true);
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
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.')
      return
    }
    setIsLiked(false);
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

  // 채팅 생성 요청
  function ChatReq() {
    fetch(('/chat/request/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: pageResult.user_id,
        productName: pageResult.productName,
        productPrice: pageResult.productPrice,
        productFrontPhoto: pageResult.productPhoto[0],
        productID: id
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('서버 응답:', data);
        alert(data.message)
        navigate('/chatList')
      })
      .catch(error => {
        console.error('fetch 오류:', error);
      });
  }

  function LoginStateButtonArea() {
    if (!pageResult || !pageResult.user_id) {
      return null;
    }

    if (whoamI.id == pageResult.user_id) {
      return (
        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
          <DeleteButtonHalf eventHandler={handleDelete} />
          <ButtonMedium text={'수정하기'} eventHandler={() => { navigate('/edit/' + id) }} />
        </div>
      )
    } else {
      return (
        <WideButton text={'채팅하기'} eventHandler={ChatReq} />
      )
    }
  }

  return (
    <div>
      <div className="Detail-Container">
        <div className="Detail-Image">
          {pageResult.productPhoto && pageResult.productPhoto.length > 0 ? (
            <DetailSlider data={pageResult.productPhoto} />
          ) : (
            <div>이미지 로딩 대기 중</div>
          )}
        </div>
        <div className="Detail-Content">
          <div className="Detail-FirstLine">
            <div className="Detail-Title">
              {pageResult.productName}
            </div>
            <div style={{ flexGrow: 1 }} />
            <div className="HeartBox">
              <div>
                {(isLiked) ?
                  <div onClick={() => { HeartOFF() }} style={{ fontSize: '20px', color: '#DB4437', cursor: 'pointer' }}>♥</div>
                  :
                  <div onClick={() => { HeartON() }} style={{ fontSize: '20px', color: '#212120', cursor: 'pointer' }}>♡</div>
                }
              </div>
              <div>
                {pageLike}
              </div>
            </div>
          </div>
          <div className="Detail-Price">
            {Number(pageResult.productPrice).toLocaleString()}원
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
              카테고리
            </div>
            <div className="Detail-Info-Content">
              {pageResult.higherCategory}
              <img
                src='/img/Category_Arrow.svg'
                style={{ width: '6px', height: '26px', marginLeft: '12px', marginRight: '12px' }}
              />
              {pageResult.lowerCategory}
            </div>
          </div>
          <Link to={'/store/' + pageResult.user_id} style={{ textDecoration: 'none', color: 'black' }}>
            <div className="Detail-UserBox">
              <div>
                <div className="Detail-UserBox-Username">
                  {pageResult.username}
                </div>
                <div className="Detail-UserBox-Userinfo">
                  <div style={{ color: '#FFBE64', marginRight: '8px' }}>
                    ★
                  </div>
                  <div>
                    9.5
                  </div>
                  <div style={{ marginLeft: '14px', marginRight: '14px' }}>
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
          </Link>
          {(isLoggedIn) ? <LoginStateButtonArea />
            :
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
              <WideButton text={'로그인하여 구매하기'} eventHandler={() => { dispatch(changeIsOpen(true)) }} />
            </div>
          }
        </div>
      </div>

      <div style={{ display: 'block', fontSize: '20px', fontFamily: 'NotoSansKR-Medium', marginTop: '180px' }}>
        같은 카테고리의 상품
      </div>
      <div class="Detail-Container">
        <Card photo={''} brand={'SainLaurant'} title={'가라1'} size={'62'} price={'1억'} />
        <Card photo={''} brand={'Gucci'} title={'가라2'} size={'62'} price={'2억'} />
        <Card photo={''} brand={'Tesla'} title={'가라3'} size={'62'} price={'3억'} />
        <Card photo={''} brand={'Apple'} title={'가라4'} size={'62'} price={'4억'} />
      </div>
    </div>
  );
}
export default Detail;