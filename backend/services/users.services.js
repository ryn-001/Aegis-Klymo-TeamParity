const User = require("../models/users.models");

const addUser = async (user) => {
    return await User.create({ ...user });
}

const deleteUser = async (user) => {
    const targetId = user._id || user.id;
    return await User.findByIdAndDelete(targetId);
}

module.exports = {addUser,deleteUser};
