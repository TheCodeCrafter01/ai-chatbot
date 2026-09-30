const {
    getUserTestService
} = require("../services/user.service");

const getUserTest = (req, res) => {
    const result = getUserTestService();

    res.json({
        success: true,
        data: result
    });
};

module.exports = {
    getUserTest
};