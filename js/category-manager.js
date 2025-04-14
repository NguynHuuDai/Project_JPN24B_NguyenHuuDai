let subjects = JSON.parse(localStorage.getItem("subjects")) || [{
        name: "Lập trình C",
        status: "Đang hoạt động"
    },
    {
        name: "Lập trình Frontend với ReactLS",
        status: "Ngừng hoạt động"
    },
    {
        name: "Lập trình Backend với Spring boot",
        status: "Đang hoạt động"
    },
    {
        name: "Lập trình Frontend với VueJS",
        status: "Ngừng hoạt động"
    },
    {
        name: "Cấu trúc dữ liệu và giải thuật",
        status: "Ngừng hoạt động"
    },
    {
        name: "Phân tích và thiết kế hệ thống",
        status: "Ngừng hoạt động"
    },
    {
        name: "Toán cao cấp",
        status: "Đang hoạt động"
    },
    {
        name: "Tiếng Anh chuyên ngành",
        status: "Ngừng hoạt động"
    }
];

let filteredSubjects = [];
for (let i = 0; i < subjects.length; i++) {
    filteredSubjects.push(subjects[i]);
}

let currentPage = 1;
const subjectsPerPage = 8;

function displayTable(page) {
    const tableBody = document.getElementById("subjectTableBody");
    tableBody.innerHTML = ""; // Xóa nội dung bảng hiện tại

    const startIndex = (page - 1) * subjectsPerPage;
    const endIndex = startIndex + subjectsPerPage;
    const currentSubjects = filteredSubjects.slice(startIndex, endIndex);

    currentSubjects.forEach((subject, i) => {
        const actualIndex = subjects.findIndex(s => s.name === subject.name && s.status === subject.status);
        const row = document.createElement("tr");

        // Kiểm tra trạng thái môn học và thay đổi màu sắc tương ứng
        const statusClass = subject.status === "Đang hoạt động" ? "hoatdong" : "ngunghoatdong"; // Lớp CSS tương ứng với trạng thái

        // Thêm div bao bọc trạng thái
        row.innerHTML = `
            <td>${subject.name}</td>
            <td><div class="status-wrapper ${statusClass}">${subject.status}</div></td> <!-- Bao bọc trạng thái bằng div -->
            <td>
                <button class="delete-btn" data-index="${actualIndex}"><i class="fa-regular fa-trash-can fa-lg"></i></button>
                <button class="edit-btn" data-index="${actualIndex}"><i class="fa-solid fa-pen fa-lg"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            editSubject(index);
        };
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            deleteSubject(index);
        };
    });
}



function displayPagination() {
    const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.toggle("active", i === currentPage);
        btn.onclick = () => {
            currentPage = i;
            displayTable(currentPage);
            displayPagination();
        };
        pagination.appendChild(btn);
    }
}

// SỬA
let editingIndex = null;

function editSubject(index) {
    editingIndex = index;
    const subject = subjects[index];
    document.getElementById("edit-subject-name").value = subject.name;
    document.getElementById("edit-active").checked = subject.status === "Đang hoạt động";
    document.getElementById("edit-inactive").checked = subject.status === "Ngừng hoạt động";
    document.getElementById("edit-popup").style.display = "flex";
}

document.getElementById("edit-save-btn").addEventListener("click", function () {
    const name = document.getElementById("edit-subject-name").value.trim();
    const status = document.getElementById("edit-active").checked ? "Đang hoạt động" : "Ngừng hoạt động";

    if (name === "") {
        alert("Tên môn học không được để trống.");
        return;
    }

    // Kiểm tra trùng tên (trừ chính nó)
    for (let i = 0; i < subjects.length; i++) {
        if (i !== editingIndex && subjects[i].name.toLowerCase() === name.toLowerCase()) {
            alert("Tên môn học đã tồn tại.");
            return;
        }
    }

    subjects[editingIndex].name = name;
    subjects[editingIndex].status = status;
    saveSubjects();

    filteredSubjects = [];
    for (let i = 0; i < subjects.length; i++) {
        filteredSubjects.push(subjects[i]);
    }

    closeEditPopup();
    displayTable(currentPage);
    displayPagination();
});

function closeEditPopup() {
    document.getElementById("edit-popup").style.display = "none";
}
document.getElementById("edit-cancel-btn").addEventListener("click", closeEditPopup);

// XÓA

// THÊM
function openPopup() {
    document.getElementById("popup").style.display = "flex";
    document.getElementById("subject-name").value = "";
    document.getElementById("active").checked = true;
    document.getElementById("popup-title").textContent = "Thêm mới môn học";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("save-btn").addEventListener("click", () => {
        const name = document.getElementById("subject-name").value.trim();
        const status = document.getElementById("active").checked ? "Đang hoạt động" : "Ngừng hoạt động";

        if (name === "") {
            alert("Vui lòng nhập tên môn học.");
            return;
        }

        // Kiểm tra trùng tên
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].name.toLowerCase() === name.toLowerCase()) {
                alert("Tên môn học đã tồn tại.");
                return;
            }
        }

        subjects.push({
            name,
            status
        });
        saveSubjects();

        filteredSubjects = [];
        for (let i = 0; i < subjects.length; i++) {
            filteredSubjects.push(subjects[i]);
        }

        closePopup();
        displayTable(currentPage);
        displayPagination();
    });

    displayTable(currentPage);
    displayPagination();
});

// LỌC & TÌM KIẾM
document.getElementById("search-icon").addEventListener("click", function () {
    const keyword = document.getElementById("search-input").value.trim().toLowerCase();
    const statusValue = document.getElementById("status-filter").value;

    filteredSubjects = [];
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const nameMatch = subject.name.toLowerCase().includes(keyword);
        let statusMatch = true;
        if (statusValue === "2") {
            statusMatch = subject.status === "Đang hoạt động";
        } else if (statusValue === "3") {
            statusMatch = subject.status === "Ngừng hoạt động";
        }

        if (nameMatch && statusMatch) {
            filteredSubjects.push(subject);
        }
    }

    currentPage = 1;
    displayTable(currentPage);
    displayPagination();
});

document.getElementById("search-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.getElementById("search-icon").click();
    }
});

document.getElementById("status-filter").addEventListener("change", function () {
    document.getElementById("search-icon").click();
});

// SNACKBAR
function showSnackbar() {
    const snackbar = document.getElementById("snackbar");
    snackbar.classList.remove("hide");
    snackbar.classList.add("show");

    setTimeout(() => {
        hideSnackbar();
    }, 3000);
}

function hideSnackbar() {
    const snackbar = document.getElementById("snackbar");
    snackbar.classList.remove("show");
    snackbar.classList.add("hide");
}

function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

//chức năng xóa

    let deleteCallback = null;

    function showConfirmationPopup(message, onDelete) {
        document.getElementById("confirmation-message").innerHTML = message;
        document.getElementById("confirmationPopup").style.display = "flex";
        deleteCallback = onDelete;
    }

    function closeConfirmationPopup() {
        document.getElementById("confirmationPopup").style.display = "none";
        deleteCallback = null;
    }

    function confirmDelete() {
        if (typeof deleteCallback === "function") {
            deleteCallback();
        }
        closeConfirmationPopup();
    }

    function deleteSubject(index) {
        showConfirmationPopup("Bạn có chắc chắn muốn xóa môn học này?", function () {
            // Thực hiện xóa
            subjects.splice(index, 1);
            saveSubjectsToLocalStorage();
            renderSubjects();
        });
    }

function deleteSubject(index) {
    showConfirmationPopup(`Bạn có chắc muốn xóa môn "${subjects[index].name}" không?`, function () {
        subjects.splice(index, 1);
        saveSubjects();

        // Cập nhật danh sách lọc
        filteredSubjects = [...subjects];

        // Điều chỉnh lại trang nếu cần
        if ((currentPage - 1) * subjectsPerPage >= filteredSubjects.length) {
            currentPage = Math.max(1, currentPage - 1);
        }

        displayTable(currentPage);
        displayPagination();

        showSnackbar(); // Hiện thông báo
    });
}

