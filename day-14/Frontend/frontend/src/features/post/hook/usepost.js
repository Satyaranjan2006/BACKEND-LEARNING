import { createPost, getFeed } from "../services/post.api.js";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";


export function usePost(){
    //handeling state layer
    const context=useContext(PostContext)
    const {loading,setLoading,post,setPost,feed,setFeed}=context


    const handleGetFeed=async ()=>{
        setLoading(true)
        const data=await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost=async(imageFile,caption)=>{
        setLoading(true);
        const data=await createPost(imageFile,caption)
        setFeed([data.post,...feed])
        setLoading(false)
    }
    useEffect(() => {
     handleGetFeed()
    }, [])
    
    return {loading,feed,post,handleGetFeed,handleCreatePost}
}