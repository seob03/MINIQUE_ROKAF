import { useState, useEffect, useRef } from 'react';
import './style/NewsList.css';
import CardSmall from '../components/CardSmall';
import CategoryDropDown from '../components/CategoryDropDown.js';

function CategoryPage() {
    let [상위카테고리, 상위카테고리변경] = useState('');
    let [하위카테고리, 하위카테고리변경] = useState('');
    let [카테고리게시글, 카테고리게시글변경] = useState('');

    const isFirstRender = useRef(true); // 첫 실행 여부를 저장할 ref

    /// 스크롤을 최상단으로 가져온다 (첫 렌더링 때만 실행)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // BEST 카테고리 불러오기 (첫 렌더링 때만 실행)
    useEffect(() => {
        fetch('/category/getBESTPosts/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                카테고리게시글변경(data);
            })
            .catch(error => console.error("BEST 카테고리 fetch 오류:", error));
    }, []);

    // 상위 카테고리 불러오기 (상위카테고리 변경 시 실행)
    useEffect(() => {
        if (!상위카테고리) return; // 상위카테고리가 없으면 요청 안 함
        fetch(`/category/getHigherPosts?higherCategory=${상위카테고리}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                카테고리게시글변경(data);
            })
            .catch(error => console.error("상위 카테고리 fetch 오류:", error));
    }, [상위카테고리]);

    // 하위 카테고리 불러오기 (첫 실행 제외)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // 첫 실행을 무시하고, 다음부터 실행되도록 설정
            return;
        }
        if (!하위카테고리) return; // 하위카테고리가 없으면 요청 안 함

        const params = new URLSearchParams({
            higherCategory: 상위카테고리,
            lowerCategory: 하위카테고리
        });

        fetch(`/category/getLowerPosts?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                카테고리게시글변경(data);
            })
            .catch(error => console.error("하위 카테고리 fetch 오류:", error));
    }, [하위카테고리]);

    return (
        <>
            <div style={{ marginTop: '30px' }}>
                <CategoryDropDown isActive_1={true}
                    상위카테고리={상위카테고리} 상위카테고리변경={상위카테고리변경}
                    하위카테고리={하위카테고리} 하위카테고리변경={하위카테고리변경}
                />
            </div>
            {
                (상위카테고리 == '' && 하위카테고리 == '') ?
                    <>
                        <div className='Category-Result'>
                            <div style={{ padding: '20px 0' }}>
                                <p style={{ color: '#666', fontSize: '16px' }}>
                                    {(카테고리게시글.length > 0) ? `BEST 카테고리 상품 ${카테고리게시글.length}개` : '추천할만한 카테고리 상품이 없습니다.'}
                                </p>
                                {카테고리게시글.length === 0 && (
                                    <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>상품이 등록되면 이곳에 표시됩니다.</p>
                                )}
                            </div>
                        </div>
                        <div className='Category-Result'>
                            {(카테고리게시글.length > 0) ? (
                                카테고리게시글.map(post => (
                                    <CardSmall
                                        photo={post.productPhoto || undefined}
                                        brand={'MONCLER'}
                                        title={post.productName}
                                        size={post.childAge}
                                        price={Number(post.productPrice).toLocaleString()}
                                        link={'/detail/' + post._id}
                                    />
                                ))
                            ) : null}
                        </div>
                    </>
                    :
                    <>
                        <div className='Category-Result'>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ color: '#666', fontSize: '16px' }}>
                                    {(카테고리게시글.length > 0) ? `${상위카테고리} 상품 ${카테고리게시글.length}개` : '해당 카테고리 상품이 없습니다.'}
                                </div>
                                {카테고리게시글.length === 0 && (
                                    <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>상품이 등록되면 이곳에 표시됩니다.</p>
                                )}
                            </div>
                        </div>
                        <div className='Category-Result'>
                            {(카테고리게시글.length > 0) ? (
                                카테고리게시글.map(post => (
                                    <CardSmall
                                        photo={post.productPhoto || undefined}
                                        brand={'MONCLER'}
                                        title={post.productName}
                                        size={post.childAge}
                                        price={Number(post.productPrice).toLocaleString()}
                                        link={'/detail/' + post._id}
                                    />
                                ))
                            ) : null}
                        </div>
                    </>
            }
        </>
    );
}
export default CategoryPage;