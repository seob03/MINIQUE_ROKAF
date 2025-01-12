import { useState, useEffect } from 'react';

import './style/Store.css';

function StorePage() {
    let [tab, setTab] = useState(0);

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
                        <div>상품 내용</div>,
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
                        OOO님의 상점
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
                            상품 개수 OO개
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
            <TabContent tab={tab} />
        </>
    );
}

export default StorePage;