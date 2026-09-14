import React, { useEffect } from 'react'
import '../style/feed.scss'
import Post from '../components/Post'
import { usePost } from '../hook/usepost'

const Feed = () => {
    const { feed, handleGetFeed, loading } = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    if(loading || !feed){
        return(
            <main><h1>feed is loading...</h1></main>
        )
    }

    return (
        <main className='feed-page'>
            <div className='feed'>
                <div className='posts'>
                    {/* <Post /> */}
                    {feed.map(post=>{
                        return <Post  user={post.user}post={post}/>
                    })}

                </div>

            </div>
        </main>

    )
}

export default Feed
