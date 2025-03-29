import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import CardSmall from '../components/CardSmall';
import './style/UserDetail.css';

function UserDetail() {
    let { user_id } = useParams();
    let [sellingPosts, setSellingPosts] = useState([]);
    let [soldPosts, setSoldPosts] = useState([]);
    let [userInfo, setUserInfo] = useState('') // username, _id 필드 반환

    let [tab, setTab] = useState(0);
    let tabRefs = [useRef(null), useRef(null)];
    let [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0px)', width: '0px' });

    // 탭이 변경될 때마다 언더바 위치와 너비를 업데이트
    useLayoutEffect(() => {
        if (tabRefs[tab].current) {
            const { offsetLeft, offsetWidth } = tabRefs[tab].current;
            setIndicatorStyle({
                transform: `translateX(${offsetLeft + (offsetWidth / 2) - (tabRefs[tab].current.firstChild.offsetWidth / 2)}px)`,
                width: `${tabRefs[tab].current.firstChild.offsetWidth}px`
            });
        }
    }, [tab]);

    // 스크롤을 최상단으로 가져온다 (첫 렌더링 때만 실행)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // 세 개의 fetch 요청을 병렬로 처리
        Promise.all([fetch('/userSellingPosts/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, })
            .then(response => response.json()),
        fetch('/userInfo/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, })
            .then(response => response.json()),
        fetch('/userSoldPosts/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, })
            .then(response => response.json())])
            .then(([sellingPostsData, userInfoData, soldPostsData]) => { // 세 개의 응답 데이터 처리
                setSellingPosts(sellingPostsData);
                setUserInfo(userInfoData);
                setSoldPosts(soldPostsData);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            });
    }, [user_id]);

    function TabContent(props) {
        let [fade, setFade] = useState('');

        useEffect(() => {
            setTimeout(() => { setFade('TabContent-End') }, 100);
            return () => {
                setFade('');
            }
        }, [tab]);

        return (
            <div className={`TabContent-Start ${fade}`}>
                {
                    [
                        <>{props.sellingPosts && props.sellingPosts.length > 0 ? (
                            <div className='TabContent-Item'>
                                {props.sellingPosts.map(post => (
                                    <CardSmall
                                        photo={post.productPhoto || undefined}
                                        brand={'Brand'}
                                        title={post.productName}
                                        size={post.childAge}
                                        price={post.productPrice}
                                        link={'/detail/' + post._id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>판매중인 상품이 없습니다.</div>
                        )}</>,
                        <>{props.soldPosts && props.soldPosts.length > 0 ? (
                            <div className='TabContent-Item'>
                                {props.soldPosts.map(post => (
                                    <CardSmall
                                        photo={post.productPhoto || undefined}
                                        brand={'Brand'}
                                        title={post.productName}
                                        size={post.childAge}
                                        price={post.productPrice}
                                        link={'/detail/' + post._id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>판매한 상품이 없습니다.</div>
                        )}</>
                    ][props.tab]
                }
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', marginTop: '36px' }}>
                <div className='Store-Image'>
                    <img src='/img/jilsander.png' className='Store-Image-Source' />
                </div>
                <div className='Store-Content'>
                    <div className='Store-Content-Name'>
                        {userInfo.username}님의 상점
                    </div>
                    <div className='Store-Content-Rate'>
                        <div style={{ fontSize: '20px', color: '#FFBE64', marginRight: '8px' }}>
                            ★
                        </div>
                        <div>
                            4.2
                        </div>
                    </div>
                    <div className='Store-Content-Detail'>
                        <div style={{ marginRight: '56px', display: 'flex' }}>
                            판매중
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem' }}>
                                {sellingPosts.length}
                            </div>
                            개
                        </div>
                        <div style={{ marginRight: '56px', display: 'flex' }}>
                            상품 판매
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem' }}>
                                {soldPosts.length}
                            </div>
                            회
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="Store-Tab">
                    <div
                        ref={tabRefs[0]}
                        className={`Store-Tab-Title ${tab === 0 ? "active" : ""}`}
                        onClick={() => setTab(0)}
                    >
                        <span>판매중</span>
                    </div>
                    <div
                        ref={tabRefs[1]}
                        className={`Store-Tab-Title ${tab === 1 ? "active" : ""}`}
                        onClick={() => setTab(1)}
                    >
                        <span>판매완료</span>
                    </div>
                    {/* 언더바 */}
                    <div className="Tab-Indicator" style={indicatorStyle}></div>
                </div>
            </div>
            <TabContent tab={tab} sellingPosts={sellingPosts} soldPosts={soldPosts} />
        </>
    );
}

export default UserDetail;