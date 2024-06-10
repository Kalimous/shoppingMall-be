const { randomStringGenerator } = require("../utils/randomStringGenerator");
const productController = require("./product.controller");


const orderController = {}

orderController.createOrder = async (req, res) => {
    try {
        const {userId} = req;
        const {shipTo, contact, totalPrice, orderList} = req.body;

        const insufficientStockItems = await productController.checkItemListStock(orderList)

        if(insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), "")
            throw new Error('errorrrr')
        }

        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomStringGenerator()
        })

        await newOrder.save()
        res.status(200).json({status: 'success', orderNum: newOrder.orderNum})
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message})
    }
}

module.exports = orderController;