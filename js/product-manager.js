// Khởi tạo dữ liệu từ localStorage hoặc dùng mảng mặc định nếu không có dữ liệu
let subjects = JSON.parse(localStorage.getItem("product")) || [{
        name: "Session 01 - Tổng quan về HTML",
        subject: "Lập trình Frontend",
        time: "45",
        status: "Đã hoàn thành"
    },
    {
        name: "Session 02 - Thẻ Inline và Block",
        subject: "Lập trình Frontend",
        time: "60",
        status: "Chưa hoàn thành"
    },
    {
        name: "Session 03 - Form và Table",
        subject: "Lập trình Frontend",
        time: "60",
        status: "Chưa hoàn thành"
    },
    {
        name: "Session 04 - CSS cơ bản",
        subject: "Lập trình Frontend",
        time: "45",
        status: "Chưa hoàn thành"
    },
    {
        name: "Session 05 - CSS layout",
        subject: "Lập trình Frontend",
        time: "60",
        status: "Chưa hoàn thành"
    },
    {
        name: "Session 06 - CSS Flex box",
        subject: "Lập trình Frontend",
        time: "45",
        status: "Đã hoàn thành"
    },
    {
        name: "Session 12 - Con trỏ trong C",
        subject: "Lập trình C",
        time: "45",
        status: "Đã hoàn thành"
    },
    {
        name: "Session 15 - Đọc và ghi file",
        subject: "Lập trình Frontend",
        time: "60",
        status: "Chưa hoàn thành"
    }
];

// Lưu dữ liệu khởi tạo vào localStorage
localStorage.setItem("product", JSON.stringify(subjects));

// Số lượng bài học hiển thị mỗi trang
const subjectsPerPage = 8;

// Trang hiện tại
let currentPage = 1;

// Danh sách bài học được lọc (theo tìm kiếm hoặc trạng thái)
let filteredSubjects = subjects;

// Hiển thị bảng bài học
function displayTable(page = 1) {
    const tableBody = document.getElementById("product");
    tableBody.innerHTML = "";

    // Tính vị trí bắt đầu và kết thúc của trang
    const startIndex = (page - 1) * subjectsPerPage;
    const endIndex = startIndex + subjectsPerPage;
    const currentSubjects = filteredSubjects.slice(startIndex, endIndex);

    // Duyệt qua các bài học và hiển thị dòng tương ứng
    currentSubjects.forEach((subject, i) => {
        // Tìm index chính xác của bài học trong mảng gốc
        const actualIndex = subjects.findIndex(s =>
            s.name === subject.name &&
            s.status === subject.status &&
            s.subject === subject.subject &&
            s.time === subject.time
        );

        // Tạo hàng trong bảng
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="label"><input type="checkbox" class="select-checkbox" data-index="${actualIndex}"></td>
            <td class="name">${subject.name}</td>
            <td class="time">${subject.time} phút</td>
            <td class="trangthai">
                <div class="${subject.status === 'Đã hoàn thành' ? 'hoatdong' : 'ngunghoatdong'}">&nbsp;• ${subject.status === 'Đã hoàn thành' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</div>
            </td>
            <td class="chucnang">
                <button class="delete-btn" data-index="${actualIndex}"><i class="fa-solid fa-trash"></i></button>
                <button class="edit-btn" data-index="${actualIndex}"><i class="fa-solid fa-pen"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Gán sự kiện cho nút xoá và sửa
    setupButtons();

    // Hiển thị phân trang
    renderPagination();
}

// Gán sự kiện click cho nút xoá và sửa
function setupButtons() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            deleteSubject(index);
        };
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            editSubject(index);
        };
    });
}

// Xoá một bài học theo index
function deleteSubject(index) {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này không?")) {
        subjects.splice(index, 1);
        localStorage.setItem("product", JSON.stringify(subjects));
        filteredSubjects = subjects;
        displayTable(currentPage);
    }
}

// Sửa thông tin bài học (hiển thị popup để sửa)
function editSubject(index) {
    // Lấy thông tin bài học hiện tại
    const subject = subjects[index];

    // Điền thông tin hiện tại vào popup
    document.getElementById("editName").value = subject.name;
    document.getElementById("editSubject").value = subject.subject;
    document.getElementById("editTime").value = subject.time;
    document.getElementById("editStatus").value = subject.status;

    // Hiển thị popup
    document.querySelector(".form-them").style.display = "block";

    // Xử lý khi nhấn nút Cập nhật
    document.getElementById("editBtn").onclick = function () {
        const newName = document.getElementById("editName").value.trim();
        const newSubject = document.getElementById("editSubject").value.trim();
        const newTime = parseInt(document.getElementById("editTime").value);
        const newStatus = document.getElementById("editStatus").value;

        // Kiểm tra và cập nhật thông tin bài học
        if (newName && newSubject && !isNaN(newTime)) {
            subjects[index] = {
                name: newName,
                subject: newSubject,
                time: newTime,
                status: newStatus
            };

            // Lưu lại vào localStorage
            localStorage.setItem("product", JSON.stringify(subjects));

            // Cập nhật lại bảng hiển thị
            filteredSubjects = subjects;
            displayTable(currentPage);

            // Ẩn popup
            document.querySelector(".form-them").style.display = "none";
        } else {
            alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
        }
    };
}

// Đóng popup khi nhấn nút đóng
document.querySelector(".close-btn").onclick = function () {
    document.querySelector(".form-them").style.display = "none";
};


// Lọc bài học theo trạng thái
function setupFilter() {
    const select = document.querySelector("select");
    select.onchange = function () {
        const value = select.value;
        if (value === "2") {
            filteredSubjects = subjects.filter(s => s.status === "Đã hoàn thành");
        } else if (value === "3") {
            filteredSubjects = subjects.filter(s => s.status === "Chưa hoàn thành");
        } else {
            filteredSubjects = subjects;
        }
        currentPage = 1;
        displayTable(currentPage);
    };
}

// Tìm kiếm bài học theo tên
function setupSearch() {
    const input = document.querySelector(".input input");
    input.oninput = function () {
        const keyword = input.value.toLowerCase().trim();
        filteredSubjects = subjects.filter(s => s.name.toLowerCase().includes(keyword));
        currentPage = 1;
        displayTable(currentPage);
    };
}

// Hiển thị nút phân trang
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = i === currentPage ? "active" : "";
        btn.onclick = () => {
            currentPage = i;
            displayTable(currentPage);
        };
        pagination.appendChild(btn);
    }
}

// Xoá nhiều bài học được chọn
function deleteSelectedSubjects() {
    const checkboxes = document.querySelectorAll(".select-checkbox:checked");
    const indexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

    if (indexes.length === 0) {
        alert("Vui lòng chọn ít nhất một bài học để xoá.");
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn xoá các bài học đã chọn?")) return;

    subjects = subjects.filter((_, i) => !indexes.includes(i));
    localStorage.setItem("product", JSON.stringify(subjects));
    filteredSubjects = subjects;
    displayTable(currentPage);
}
// Gán sự kiện đóng cho nút đóng
const closeBtn = document.querySelector(".close-btn");
const popup = document.querySelector(".form-them");

closeBtn.onclick = () => {
    popup.style.display = "none"; // Đóng popup
};



// Gán sự kiện thêm bài học mới
document.getElementById("addBtn").addEventListener("click", function () {
    const name = document.getElementById("newName").value.trim();
    const subject = document.getElementById("newSubject").value.trim();
    const time = document.getElementById("newTime").value.trim();
    const status = document.getElementById("newStatus").value;

    if (!name || !subject || !time || isNaN(parseInt(time))) {
        alert("Vui lòng nhập đầy đủ và chính xác thông tin.");
        return;
    }

    subjects.push({
        name: name,
        subject: subject,
        time: parseInt(time),
        status: status
    });

    localStorage.setItem("product", JSON.stringify(subjects));
    filteredSubjects = subjects;
    displayTable(currentPage);

    // Xoá nội dung form
    document.getElementById("newName").value = "";
    document.getElementById("newSubject").value = "";
    document.getElementById("newTime").value = "";
    document.getElementById("newStatus").value = "Đã hoàn thành";

    alert("Đã thêm bài học thành công!");
});
document.querySelector(".btn-open").addEventListener("click", function () {
    const form = document.querySelector(".form-them");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

// Tạo nút xoá nhiều và gán sự kiện khi DOM được load
document.addEventListener("DOMContentLoaded", () => {
    const delBtn = document.createElement("button");
    delBtn.innerText = "Xoá nhiều";
    delBtn.style.margin = "10px";
    delBtn.addEventListener("click", deleteSelectedSubjects);
    document.querySelector(".frame1").appendChild(delBtn);
});

// Khởi chạy ban đầu: setup bộ lọc, tìm kiếm và hiển thị bảng
function init() {
    setupFilter();
    setupSearch();
    displayTable(currentPage);
}


// Gọi hàm init khi trang được load
window.onload = init;
