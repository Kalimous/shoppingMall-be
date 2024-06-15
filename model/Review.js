const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('../model/User'); // 불필요한 import 제거
const Product = require('./Product');

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // 최소값 설정 (선택사항)
        max: 5  // 최대값 설정 (선택사항)
    },
    description: {
        type: String,
        required: true
    },
    orderNum: {
        type: String,
        required: true
    }
}, {
    timestamps: true // 생성 및 수정 시간을 자동으로 기록
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
