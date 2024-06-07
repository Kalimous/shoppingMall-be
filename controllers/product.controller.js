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
        const cond = {
            isDeleted: false, // isDelete 필드가 false인 상품만 필터링
            ...(name && { name: { $regex: name, $options: "i" } }), // 이름 필터링 조건 추가
        };

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

        response ? console.log(response) : console.log("nothing");

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            sku,
            name,
            size,
            image,
            price,
            description,
            category,
            stock,
            status,
        } = req.body;
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            {
                sku,
                name,
                size,
                image,
                price,
                description,
                category,
                stock,
                status,
            },
            { new: true }
        );

        if (!product) throw new Error("상품을 찾을 수 없습니다.");
        res.status(200).json({ stauts: "success", data: product });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { isDeleted: true },
            { new: true }
        );
        if (!product) throw new Error("상품을 찾을 수 없습니다.");
        res.status(200).json({ stauts: "success", data: product });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

productController.getSelectProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById({ _id: productId });
        if (!product) throw new Error("상품을 찾을 수 없습니다.");
        res.status(200).json({ stauts: "success", data: product });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = productController;
