document.addEventListener("DOMContentLoaded", function () {
    const btnDangKy = document.getElementById("btnDangKy");

    btnDangKy.addEventListener("click", function (e) {
        e.preventDefault();

        const hoVaTenDem = document.getElementById("hoVaTenDem");
        const ten = document.getElementById("ten");
        const email = document.getElementById("email");
        const matKhau = document.getElementById("matKhau");

        const loiHoVaTenDem = document.getElementById("loiHoVaTenDem");
        const loiTen = document.getElementById("loiTen");
        const loiEmail = document.getElementById("loiEmail");
        const loiMatKhau = document.getElementById("loiMatKhau");

        loiHoVaTenDem.textContent = "";
        loiTen.textContent = "";
        loiEmail.textContent = "";
        loiMatKhau.textContent = "";

        hoVaTenDem.classList.remove("input-error");
        ten.classList.remove("input-error");
        email.classList.remove("input-error");
        matKhau.classList.remove("input-error");

        let hopLe = true;

        if (hoVaTenDem.value.trim() === "") {
            loiHoVaTenDem.textContent = "Họ và tên đệm không được để trống";
            hoVaTenDem.classList.add("input-error");
            hopLe = false;
        }

        if (ten.value.trim() === "") {
            loiTen.textContent = "Tên không được để trống";
            ten.classList.add("input-error");
            hopLe = false;
        }

        if (email.value.trim() === "") {
            loiEmail.textContent = "Email không được để trống";
            email.classList.add("input-error");
            hopLe = false;
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value.trim())) {
            loiEmail.textContent = "Email không đúng định dạng";
            email.classList.add("input-error");
            hopLe = false;
        }

        if (matKhau.value.trim() === "") {
            loiMatKhau.textContent = "Mật khẩu không được để trống";
            matKhau.classList.add("input-error");
            hopLe = false;
        } else if (matKhau.value.length < 8) {
            loiMatKhau.textContent = "Mật khẩu phải ít nhất 8 ký tự";
            matKhau.classList.add("input-error");
            hopLe = false;
        }

        if (hopLe) {
            const newUser = {
                hoVaTenDem: hoVaTenDem.value.trim(),
                ten: ten.value.trim(),
                email: email.value.trim(),
                matKhau: matKhau.value.trim()
            };

            const userList = JSON.parse(localStorage.getItem("userList")) || [];

            const emailTrung = userList.some(user => user.email === newUser.email);
            if (emailTrung) {
                loiEmail.textContent = "Email này đã được đăng ký.";
                email.classList.add("input-error");
                return;
            }

            userList.push(newUser);

            localStorage.setItem("userList", JSON.stringify(userList));
            window.location.href = "login.html";
        }
    });
});
