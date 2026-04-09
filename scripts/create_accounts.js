import dotenv from 'dotenv';
import User from '../api/models/User.js';

dotenv.config();

async function createAccounts() {
  try {
    console.log("Đang tạo tài khoản Admin...");
    let admin = null;
    try {
        admin = await User.findOne({ username: 'admin' });
    } catch(e) {}
    
    if (admin) {
        console.log("Tài khoản admin đã tồn tại.");
    } else {
        await User.create({
            username: 'admin',
            email: 'admin@chemodyssey.com',
            password: 'password123',
            role: 'admin'
        });
        console.log("Đã tạo tài khoản Admin thành công! (Tài khoản: admin / Mật khẩu: password123)");
    }

    console.log("Đang tạo tài khoản Giáo viên...");
    let teacher = null;
    try {
        teacher = await User.findOne({ username: 'teacher' });
    } catch(e) {}
    
    if (teacher) {
        console.log("Tài khoản teacher đã tồn tại.");
    } else {
        await User.create({
            username: 'teacher',
            email: 'teacher@chemodyssey.com',
            password: 'password123',
            role: 'teacher'
        });
        console.log("Đã tạo tài khoản Giáo viên thành công! (Tài khoản: teacher / Mật khẩu: password123)");
    }

  } catch (err) {
    console.error("Lỗi khi tạo tài khoản:", err);
  }
}

createAccounts();
