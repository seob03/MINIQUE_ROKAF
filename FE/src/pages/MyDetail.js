import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";

import Card from '../components/Card';
import CardSmall from '../components/CardSmall';

import './style/MyDetail.css';

function MyDetail() {
    let [tab, setTab] = useState(0);
    let [sellingPosts, setSellingPosts] = useState([]);
    let [favoritePosts, setFavoritePosts] = useState([]);

    // 본인의 게시글 가져오기
    useEffect(() => {
        fetch(('/myDetail/getPosts'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setSellingPosts(data);
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);

    // 본인이 찜 누른 항목 가져오기
    useEffect(() => {
        fetch(('/myDetail/getFavoritePosts'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setFavoritePosts(data);
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);


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
                            {props.SellingPosts && props.SellingPosts.length > 0 ? (
                                <div className='TabContent-Item'>
                                    {props.SellingPosts.map(post => (
                                        <CardSmall
                                            photo={post.productPhoto[0] || undefined}
                                            brand={'Brand'}
                                            title={post.productName}
                                            size={post.childAge}
                                            price={Number(post.productPrice).toLocaleString()}
                                            link={'/detail/' + post._id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>판매중인 상품이 없습니다.</div>
                            )}
                        </>,
                        <div>
                            <>
                                {props.favoritePosts && props.favoritePosts.length > 0 ? (
                                    <div className='TabContent-Item'>
                                        {props.favoritePosts.map(post => (
                                            <CardSmall
                                                photo={post.productPhoto[0] || undefined}
                                                brand={'Brand'}
                                                title={post.productName}
                                                size={post.childAge}
                                                price={Number(post.productPrice).toLocaleString()}
                                                link={'/detail/' + post._id}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div>찜해둔 상품이 없습니다.</div>
                                )}
                            </>
                        </div>
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
                        내 상점
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
                                {/*soldPosts.length*/}
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
                        상품
                        {(tab == '0') ?? <img src='/img/Tab_Bar.svg' style={{ width: '60px' }} />}
                    </div>
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(1)}>
                        찜
                    </div>
                </div>
            </div>
            <TabContent tab={tab} SellingPosts={sellingPosts} favoritePosts={favoritePosts} />
        </>
    );
}

export default MyDetail;