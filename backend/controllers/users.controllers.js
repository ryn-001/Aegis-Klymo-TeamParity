const {UserServices} = require("../services/index.services");

const addUser = async (req, res) => {
    try {
        const userData = req.body; 
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ success: false, message: 'User data is missing' });
        }

        await UserServices.addUser(userData);

        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error("Controller Error:", err); 
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userData = req.body; 

        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User data required for deletion' 
            });
        }

        await UserServices.deleteUser(userData);

        return res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (err) {
        console.error("Delete Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {addUser,deleteUser};