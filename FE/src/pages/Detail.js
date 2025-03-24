import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CardSmall from '../components/CardSmall';
import DetailSlider from "../components/DetailSlider.js";
import { ButtonMedium, WideButton, DeleteButtonHalf } from '../components/Buttons';
import { changeIsOpen } from "../store/store.js";
import './style/Detail.css';
import { showAlert, showConfirm } from '../components/Util.js';

function Detail() {
  let [pageResult, setPageResult] = useState([]);
  let [pageLike, setPageLike] = useState(0);
  let isLoggedIn = useSelector((state) => { return state.isLoggedIn })
  let [isLiked, setIsLiked] = useState(false);
  let [whoamI, setWhoAmI] = useState('');
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { id } = useParams(); // 글 id (String)
  let [recommend, setRecommend] = useState('');

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

  // 판매 처리 함수
  function sold() {
    showConfirm({
      title: "판매 완료로 변경하시겠어요?",
      text: "한 번 변경하면 되돌릴 수 없습니다.",
      confirmText: "네, 판매 완료 됐어요!",
      cancelText: "아니요, 취소할래요!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/sold/' + id, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              showAlert({
                title: "판매 완료",
                text: "상품이 성공적으로 거래되었습니다.",
                icon: "success",
              }).then(() => {
                navigate("/");
              });
            } else {
              showAlert({
                title: "처리 실패",
                text: "판매 완료 처리 중 문제가 발생했습니다.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("판매 처리 fetch 오류:", error);
            showAlert({
              title: "오류 발생",
              text: "판매 완료 처리 중 오류가 발생했습니다.",
              icon: "error",
            });
          });
      }
    });
  }
  // 글 삭제함수
  function handleDelete() {
    showConfirm({
      title: "글을 삭제하시겠습니까?",
      text: "삭제된 글은 복구되지 않습니다.",
      confirmText: "네, 삭제합니다!",
      cancelText: "아니요, 취소할래요!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/productDetail/delete/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === true) {
              showAlert({
                title: "삭제 완료!",
                text: "글이 정상적으로 삭제되었습니다.",
                icon: "success",
              }).then(() => {
                navigate("/");
              });
            } else {
              showAlert({
                title: "삭제 실패",
                text: "삭제 권한이 존재하지 않습니다.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            showAlert({
              title: "오류 발생!",
              text: "삭제 중 오류가 발생했습니다.",
              icon: "error",
            });
          });
      }
    });
  }

  // 찜 기능
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
    fetch('/chat/request/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: pageResult.user_id,
        productName: pageResult.productName,
        productPrice: pageResult.productPrice,
        productFrontPhoto: pageResult.productPhoto[0],
        productID: id
      }),
      credentials: 'include' // 세션 정보도 함께 전송 (로그인 상태 유지)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => Promise.reject(err));
        }
        return response.json();
      })
      .then(data => {
        console.log('서버 응답:', data);
        showAlert({
          title: "채팅방 생성 완료!",
          text: "채팅 목록으로 이동할게요!",
          icon: "success",
        }).then(() => {
          navigate('/chatList'); // 채팅방 리스트로 이동
        });
      })
      .catch(error => {
        console.error('fetch 오류:', error);
        showAlert({
          title: "채팅방 생성 실패",
          text: error?.message || "서버 오류 발생",
          icon: "error",
        });
      });
  }
  // 로그인에 따라 버튼 달라지도록
  function LoginStateButtonArea() {
    if (!pageResult || !pageResult.user_id) {
      return null;
    }

    if (whoamI.id == pageResult.user_id) {
      return (
        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
          <DeleteButtonHalf eventHandler={handleDelete} />
          <ButtonMedium text={'수정하기'} eventHandler={() => { navigate('/edit/' + id) }} />
          <ButtonMedium text={'판매완료'} eventHandler={sold} />
        </div>
      )
    } else {
      return (
        <WideButton text={'채팅하기'} eventHandler={ChatReq} />
      )
    }
  }

  // 카테고리 같은 추천 게시글 불러오기
  useEffect(() => {
    const params = new URLSearchParams({
      higherCategory: pageResult.higherCategory,
      lowerCategory: pageResult.lowerCategory
    });
    fetch(`/category/getHigherPosts?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        setRecommend(data)
      })
      .catch(error => console.error("fetch 오류:", error));
  }, [pageResult]);

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
                  <img src="/img/Heart_Fill.svg" onClick={() => { HeartOFF() }} className='HeartBox-Image' />
                  : <img src="/img/Heart_Unfill.svg" onClick={() => { HeartON() }} className='HeartBox-Image' />
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
              {pageResult.childAge}개월
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
      <div className="Detail-Recommend">
        {
          (recommend.length > 0) ? (
            recommend.map(post => (
              <CardSmall
                photo={post.productPhoto || undefined}
                brand={'MONCLER'}
                title={post.productName}
                size={post.childAge}
                price={Number(post.productPrice).toLocaleString()}
                link={'/detail/' + post._id}
              />
            ))
          ) : <div>이런, 같은 카테고리의 상품이 존재하지 않아요.</div>
        }
      </div>
    </div>
  );
}
export default Detail;