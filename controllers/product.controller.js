const productController = {};
const Product = require("../model/Product");
const PAGE_SIZE = 5;

productController.createProduct = async (req, res) => {
    try {
        const {
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status,
        } = req.body;
        const product = new Product({
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status,
        });
        await product.save();
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

productController.getProducts = async (req, res) => {
    try {
        const { page = 1, name } = req.query;
        const cond = name ? { name: { $regex: name, $options: "i" } } : {};

        let query = Product.find(cond);

        if (page) {
            query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
        }

        const totalItemNum = await Product.find(cond).countDocuments();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        const productList = await query.exec();

        const response = {
            status: "success",
            totalPageNum,
            data: productList,
        };

        console.log("r", response);

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = productController;

module.exports = productController;
