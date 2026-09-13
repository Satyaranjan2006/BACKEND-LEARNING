import React from 'react'
import '../style/feed.scss'

const Feed = () => {
    return (
        <main className='feed-page'>
            <div className='feed'>
                <div className='posts'>
                    <div className='post'>
                        <div className='user'>
                            <div className='img-wrapper'>
                                <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                            </div>


                            <p>UserName</p>

                        </div>
                        <img src="https://plus.unsplash.com/premium_photo-1710961232986-36cead00da3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBvc3R8ZW58MHx8MHx8fDA%3D" alt="" />
                        <div className='buttom'>
                            <p className='caption'> Caption Caption</p>
                        </div>
                    </div>

                </div>

            </div>
        </main>

    )
}

export default Feed
