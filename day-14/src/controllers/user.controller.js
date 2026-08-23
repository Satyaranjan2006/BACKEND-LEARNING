const express = require('express')
const followModel = require('../models/follow.model')
const userModel = require('../models/user.model')



async function followUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    /// ------------------check -1 -----------------------

    // // check whether the  the same user follow to himself
    if (followerUsername == followeeUsername) {
        return res.status(400).json({
            message: 'you can not follow to yourself'
        })
    }

    //---------------- CHECK-2-------------------------

    //when user-A follow to user-B  ,after once following operation again user-A follows user-B

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message: `Already ${followerUsername} follow to ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }


    //---------------- CHECK-3-------------------------

    // to check whether the followee exist in database to which the another user want to follow

    const isFolloweeExist = await userModel.findOne({
        username: followeeUsername
    })

    if (!isFolloweeExist) {
        return res.status(400).json({
            message: 'The user you want to follow does not exist'
        })
    }


    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })
    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })
}

async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    /// ------------------check -1 -----------------------

    //check whether the combination exist before delete

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: 'You are not following the perticular user'
        })
    }

    await followModel.findOneAndDelete({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(200).json({
        message: `Unfollowed to ${followeeUsername}  Successfully`
    })
}


module.exports = { followUserController ,unfollowUserController}