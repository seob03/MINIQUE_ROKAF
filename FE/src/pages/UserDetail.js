import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";

import './style/Store.css';

function UserDetail() {
    let [tab, setTab] = useState(0);
    let { user_id } = useParams();
    let [posts, setPosts] = useState('');
    let [userInfo, setUserInfo] = useState('')
    useEffect(() => {
        // 두 개의 fetch 요청을 병렬로 처리
        Promise.all([
            fetch('/userPosts/' + user_id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(response => response.json()),
    
            fetch('/userInfo/' + user_id, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(response => response.json())
        ])
        .then(([postsData, userInfoData]) => {
            // 두 요청이 성공적으로 완료된 후 결과 처리
            setPosts(postsData);
            setUserInfo(userInfoData);
            console.log('서버 응답 >> postsData:', postsData, 'userInfoData:', userInfoData);
        })
        .catch(error => {
            console.error('fetch 오류:', error);
        });
    }, [user_id]);
    
    useEffect(()=>{
        console.log('posts:', posts)
    }, [posts])

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
                        <div>
                            {/* 상품 리스트 출력 @@@@@ 이거 조건으로 useEffect로 값 세팅 후에 
                            사용하도록 설정해야함 안그러면 useEffect가 나중에 활성화 돼서 랜더링이 먼저 되고 
                            그러면 posts 출력하는데 오류가 생김 정확한 이유는 아직 모름 + 정리하기*/}
                            {props.posts && props.posts.length > 0 ? (
                                <div>
                                    {props.posts.map(post => (
                                        <div key={post._id}>
                                            <h3>{post.productName}</h3>
                                            <p>{post.productDetailContent}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>상품이 없습니다.</p>
                            )}
                        </div>,
                        <div>후기 내용</div>
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
                        <div style={{ marginRight: '56px' }}>
                            상품 판매 OO회 
                        </div>
                        <div style={{ marginRight: '56px' }}>
                            상품 개수 {posts.length}
                        </div>
                        <div>
                            후기 O건
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="Store-Tab">
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(0)}>
                        상품
                        {(tab == '0') ?? <img src='/img/Tab_Bar.svg' style={{ width: '60px' }} />}
                    </div>
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(1)}>
                        후기
                    </div>
                </div>
            </div>
            <TabContent tab={tab} posts={posts} />
        </>
    );
}

export default UserDetail;