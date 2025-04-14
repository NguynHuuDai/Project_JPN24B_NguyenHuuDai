document.addEventListener("DOMContentLoaded", function () {
    const btnDangNhap = document.getElementById("btnDangNhap");

    btnDangNhap.addEventListener("click", function (e) {
        e.preventDefault();

        const email = document.getElementById("email");
        const matKhau = document.getElementById("matKhau");
        const loiMatKhau = document.getElementById("loiMatKhau");

        loiMatKhau.textContent = "";
        email.classList.remove("input-error");
        matKhau.classList.remove("input-error");

        const emailValue = email.value.trim();
        const matKhauValue = matKhau.value.trim();

        let hasError = false;
// check rỗng email
        if (emailValue === "") {
            loiMatKhau.textContent = "Vui lòng nhập email.";
            email.classList.add("input-error");
            hasError = true;
        }
// check rỗng
        if (matKhauValue === "") {
            if (loiMatKhau.textContent !== "") {
                loiMatKhau.textContent += " ";
            }
            loiMatKhau.textContent += "Vui lòng nhập mật khẩu.";
            matKhau.classList.add("input-error");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const userList = JSON.parse(localStorage.getItem("userList")) || [];

        const user = userList.find(u =>
            u.email === emailValue && u.matKhau === matKhauValue
        );

        if (!user) {
            loiMatKhau.textContent = "Mật khẩu không đúng hoặc tài khoản không tồn tại.";
            email.classList.add("input-error");
            matKhau.classList.add("input-error");
        } else {
            const nhoTaiKhoan = document.getElementById("checkbox").checked;
            if (nhoTaiKhoan) {
                localStorage.setItem("currentUser", JSON.stringify(user));
            } else {
                sessionStorage.setItem("currentUser", JSON.stringify(user));
            }
            window.location.href = "category-manager.html";
        }
    });
});
