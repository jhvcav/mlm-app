const jwt = require("jsonwebtoken");

const user = {
    _id: "67c7490b4f1df78392872472", // ID de ton compte superadmin
    role: "superadmin",
    permissions: {
        canCreateAdmin: true,
        canCreateMember: true,
        canDeleteUser: true,
        canEditUser: true,
        canAccessSuperAdminDashboard: true,
        canAccessAdminDashboard: true
    }
};

const token = jwt.sign(user, "supersecretkey", { expiresIn: "7d" });

console.log("Votre nouveau token :", token);