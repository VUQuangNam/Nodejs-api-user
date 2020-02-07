const mongoose = require('mongoose')

// Import  model
Products = require('../model/product.model');

// Handle index actions
exports.list = function (req, res) {
    Products.get(function (error, Products) {
        if (error) {
            res.json({
                message: error,
            });
        }
        res.json({
            message: "Danh sách sản phẩm",
            data: Products
        });
    });
};

exports.create = (req, res) => {
    const { name, description, unit, price } = req.body;
    var product = new Products({
        _id: mongoose.Types.ObjectId(),
        name,
        description,
        unit,
        price,
        create_by: {
            id: req.userData.id,
            name: req.userData.name
        }
    });
    product.save(async (error, product) => {
        if (error) {
            res.json(
                {
                    code: false,
                    message: 'Tạo mới thất bại'
                }
            );
            return;
        } else {
            res.json({
                message: 'Thêm mới thành công!',
                data: product
            });
        }
    });
};

exports.detail = function (req, res) {
    Products.findById(req.params.product_id, function (error, product) {
        if (error)
            res.send(error);
        res.json({
            data: product
        });
    });
};

// Handle update product info
exports.update = async (req, res) => {
    try {
        const { product_id } = req.params;
        const body = req.body;
        body.update_at = Date.now();
        let data = await Products.findOne({ _id: product_id });
        if (data) {
            respont = await Products.updateOne(
                { _id: product_id }, body
            );
            if (!respont) return res.json({
                message: 'Không tìm thấy sản phẩm được update'
            });
            if (respont.nModified === 0) return res.json({
                message: 'Dữ liệu không có gì thay đổi'
            });
            return res.json({
                message: 'Cập nhật dữ liệu thành công'
            });
        } else {
            return res.json({ message: 'ID không đúng' });
        }
    } catch (err) {
        return handlePageerroror(res, err)
    }
};

// Handle delete product
exports.delete = function (req, res) {
    Products.remove({
        _id: req.params.product_id
    }, function (error) {
        if (error)
            res.send(error);
        res.json({
            status: "success",
            message: 'Xóa Thành Công'
        });
    });
};
