const router = require('express').Router();
const validate = require('express-validation');

const checkAuth = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

const userCondition = require('../condition/user.condition');
const productCondition = require('../condition/product.condition');
const permissionCondition = require('../condition/permission.condition');

const { UserValidation, ListUserValidation } = require('../validate/user.validate');
const { ProductValidation, ListProductsValidation } = require('../validate/product.validate');
const { PermissionValidation, ListPermissionsValidation } = require('../validate/permission.validate')

var userController = require('../controller/user.controller');
var perController = require('../controller/permission.controller');
var productController = require('../controller/product.controller');
const accountController = require('../controller/account.controller')

// user routes
router.route('/users')
    .get(checkAuth,
        validate(ListUserValidation),
        checkRole('listUser'),
        userCondition.condition,
        userController.list
    )
    .post(checkAuth,
        checkRole('createUser'),
        validate(UserValidation),
        userController.create);
router.route('/users/:user_id')
    .get(checkAuth,
        checkRole('detailUser'),
        userController.detail)
    .put(checkAuth,
        checkRole('updateUser'),
        validate(UserValidation),
        userController.update)
    .delete(checkAuth,
        checkRole('deleteUser'),
        userController.delete);

// permission router
router.route('/permissions')
    .get(checkAuth,
        validate(ListPermissionsValidation),
        permissionCondition.condition,
        perController.list
    )
    .post(checkAuth,
        validate(PermissionValidation),
        perController.create);
router.route('/permissions/:permission_id')
    .get(checkAuth,
        perController.detail)
    .put(checkAuth,
        validate(PermissionValidation),
        perController.update)
    .delete(checkAuth,
        perController.delete);

// router product
router.route('/products')
    .get(checkAuth,
        validate(ListProductsValidation),
        productCondition.condition,
        productController.list
    )
    .post(checkAuth,
        validate(ProductValidation),
        productController.create);
router.route('/products/:product_id')
    .get(checkAuth,
        productController.detail)
    .put(checkAuth,
        validate(ProductValidation),
        productController.update)
    .delete(checkAuth,
        productController.delete);

router.route('/login').post(accountController.login);

router.route('/logout').post(accountController.logout);

router.route('/changePas')
    .post(checkAuth,
        accountController.changePass
    )

// Export API routes
module.exports = router;