import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import CardSmall from '../components/CardSmall';
import './style/UserDetail.css';

function UserDetail() {
    let [tab, setTab] = useState(0);
    let { user_id } = useParams();
    let [sellingPosts, setSellingPosts] = useState([]);
    let [soldPosts, setSoldPosts] = useState([]);
    let [userInfo, setUserInfo] = useState('') // username, _id 필드 반환

    /// 스크롤을 최상단으로 가져온다 (첫 렌더링 때만 실행)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // 세 개의 fetch 요청을 병렬로 처리
        Promise.all([
            fetch('/userSellingPosts/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, }).then(response => response.json()),
            fetch('/userInfo/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, }).then(response => response.json()),
            fetch('/userSoldPosts/' + user_id, { method: 'GET', headers: { 'Content-Type': 'application/json' }, }).then(response => response.json()),
        ])
            .then(([sellingPostsData, userInfoData, soldPostsData]) => { // 세 개의 응답 데이터 처리
                setSellingPosts(sellingPostsData);
                setUserInfo(userInfoData);
                setSoldPosts(soldPostsData);
                console.log('서버 응답 >> sellingPostsData:', sellingPostsData, 'userInfoData:', userInfoData, 'soldPostsData:', soldPostsData);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            });
    }, [user_id]);

    function TabContent(props) {
        let [fade, setFade] = useState('')

        useEffect(() => {
            setTimeout(() => { setFade('TabContent-End') }, 100)
            return () => {
                setFade('')
            }
        }, [tab])

        return (

            <div className={`TabContent-Start ${fade}`}>
                {
                    [
                        <>
                            {props.sellingPosts && props.sellingPosts.length > 0 ? (
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
                            )}
                        </>,
                        <>
                            {props.soldPosts && props.soldPosts.length > 0 ? (
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
                            )}
                        </>
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
                <div class="Store-Tab">
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(0)}>
                        판매중
                        {(tab == '0') ?? <img src='/img/Tab_Bar.svg' style={{ width: '60px' }} />}
                    </div>
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(1)}>
                        판매완료
                    </div>
                </div>
            </div>
            <TabContent tab={tab} sellingPosts={sellingPosts} soldPosts={soldPosts} />
        </>
    );
}

export default UserDetail;