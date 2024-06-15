    const Order = require("../model/Order");
    const Review = require("../model/Review");
    const mongoose = require('mongoose')

    const reviewController = {}

    reviewController.createReview = async (req, res) => {
        try {
            const {userId, productId, rating, description, orderNum} = req.body;
            const newReview = new Review({
                userId,productId,rating, description, orderNum
            })
            await newReview.save()
            const order = await Order.findOne({orderNum: newReview.orderNum})
            order.isWriteReview = true
            await order.save()
            res.status(200).json({status: 'success', newReview})
        } catch(error) {
            res.status(400).json({status: 'fail', message: error.message})
        }
    }

    reviewController.getReviews = async (req, res) => {
        try {
            const {id} = req.params;
            console.log(id)
            const reviews = await Review.find({productId: id}).populate('userId')
            console.log(reviews)
            if(!reviews || reviews.length === 0) throw new Error('리뷰가 없습니다')
            res.status(200).json({status: 'success', reviews})
        } catch(error) {
            res.status(400).json({status: 'fail', message: error.message})
        }
    } 

    module.exports = reviewController;