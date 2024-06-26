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
        res.status(400).json({ status: "fail1", message: error.message });
    }
};

productController.getProducts = async (req, res) => {
    try {
        const { page = 1, name } = req.query;

        if(!name) {
            const products = await Product.find({})
            if(!products) throw new Error('상품이 존재하지 않습니다')
            res.status(200).json({status: 'success', data: products})
            return;
        }

        const cond = {
            isDeleted: false, // isDeleted 필드가 false인 상품만 필터링
            ...(name && { name: { $regex: name, $options: "i" } }), // 이름 필터링 조건 추가
        };

        const totalItemNum = await Product.find(cond).countDocuments();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        const productList = await Product.find(cond)
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .exec();

        const response = {
            status: "success",
            totalPageNum,
            data: productList,
        };

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
        res.status(400).json({ status: "fail3", message: error.message });
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
        res.status(400).json({ status: "fail4", message: error.message });
    }
};

productController.getSelectProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById({ _id: productId });
        if (!product) throw new Error("상품을 찾을 수 없습니다.");
        res.status(200).json({ stauts: "success", data: product });
    } catch (error) {
        res.status(400).json({ status: "fail5", message: error.message });
    }
};

productController.checkStock = async (item) => {
    try {
        const product = await Product.findById(item.productId);

        if (product.stock[item.size] < item.qty) {
            return {
                isVerify: false,
                message: `${product.name}의 ${item.size}재고가 부족합니다.`,
            };
        }

        const newStock = { ...product.stock };
        newStock[item.size] -= item.qty;
        product.stock = newStock;

        await product.save();

        return { isVerify: true };
    } catch (error) {
        res.status(400).json({ status: "fail6", message: error.message });
    }
};

productController.checkItemListStock = async (itemList, res, req) => {
    try {
        const insufficientStockItems = [];
        await Promise.all(
            itemList.map(async (item) => {
                const stockCheck = await productController.checkStock(item);
                if (!stockCheck.isVerify) {
                    insufficientStockItems.push({
                        item,
                        message: stockCheck.message,
                    });
                }
                return stockCheck;
            })
        );
        return insufficientStockItems;
    } catch (error) {
        res.status(400).json({ status: "fail7", message: error.message });
    }
};

module.exports = productController;
