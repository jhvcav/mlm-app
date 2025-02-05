const bcrypt = require('bcryptjs');
bcrypt.hash("admin123", 10, function(err, hash) {
    if (err) console.error(err);
    else console.log(hash);
});