let employees = [
    { id: 1, firstName: "Ashlin", lastName: "Shijo", email: "ashlin@gmail.com", department: "IT", role: "Full Stack Developer" },
    { id: 2, firstName: "Babin", lastName: "Jo", email: "babin@gmail.com", department: "IT", role: "Senior Developer" },
    { id: 3, firstName: "Akash", lastName: "Mass", email: "akash@gmail.com", department: "Finance", role: "Analyst" },
    { id: 4, firstName: "Diana", lastName: "Mary", email: "daina@gamil.com", department: "Marketing", role: "Coordinator" },
    { id: 5, firstName: "Rahul", lastName: "Dregop", email: "rahul@gmail.com", department: "IT", role: "Developer" },
    { id: 6, firstName: "Fiona", lastName: "Davis", email: "fiona@gmail.com", department: "Sales", role: "Manager" },
    { id: 7, firstName: "George", lastName: "Miller", email: "george@egmail.com", department: "Operations", role: "Specialist" },
    { id: 8, firstName: "Helen", lastName: "Heller", email: "helen@gmail.com", department: "HR", role: "Specialist" },
    { id: 9, firstName: "Ivan", lastName: "neo", email: "ivan@gmail.com", department: "Finance", role: "Associate" },
    { id: 10, firstName: "Julia", lastName: "Ashlin", email: "julia@gmail.com", department: "Marketing", role: "Manager" }
];

let currentPage = 1;
let perPage = 3;
let sortBy = "firstName";
let search = '';
let editingId = null;


function renderEmployees() {
    let filtered = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(search) ||
        emp.lastName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
    );
    filtered.sort((a, b) => {
        if (sortBy === "firstName") return a.firstName.localeCompare(b.firstName);
        if (sortBy === "department") return a.department.localeCompare(b.department);
        return 0;
    });
    let total = filtered.length;
    let totalPages = Math.ceil(total / perPage);
    currentPage = Math.min(currentPage, totalPages) || 1;
    let start = (currentPage - 1) * perPage;
    let paginated = filtered.slice(start, start + perPage);

    const list = document.getElementById('employeeList');
    list.innerHTML = paginated.map(emp => `
        <div class="employee-card">
            <strong>${emp.firstName} ${emp.lastName}</strong>
            <div>Email: ${emp.email}</div>
            <div>Department: ${emp.department}</div>
            <div>Role: ${emp.role}</div>
            <div>
                <button class="edit-btn" data-id="${emp.id}">Edit</button>
                <button class="delete-btn" data-id="${emp.id}">Delete</button>
            </div>
        </div>
    `).join('') || `<div>No employees found.</div>`;


    let pagHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        pagHtml += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    document.getElementById('pagination').innerHTML = pagHtml;
}

function openModal(edit = false, emp = {}) {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = edit ? 'Edit Employee' : 'Add Employee';
    document.getElementById('submitBtn').textContent = edit ? 'Save' : 'Add';
    const form = document.getElementById('employeeForm');
    form.firstName.value = emp.firstName || '';
    form.lastName.value = emp.lastName || '';
    form.email.value = emp.email || '';
    form.department.value = emp.department || '';
    form.role.value = emp.role || '';
    document.getElementById('formErrors').textContent = '';
}
function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('employeeForm').reset();
    editingId = null;
}


document.getElementById('addEmployeeBtn').onclick = () => openModal();
document.getElementById('cancelBtn').onclick = closeModal;

document.getElementById('employeeList').onclick = function(e) {
    if (e.target.classList.contains('edit-btn')) {
        const id = Number(e.target.dataset.id);
        const emp = employees.find(emp => emp.id === id);
        editingId = id;
        openModal(true, emp);
    }
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        if (confirm("Are you sure you want to delete this employee?")) {
            employees = employees.filter(emp => emp.id !== id);
            renderEmployees();
        }
    }
};

document.getElementById('employeeForm').onsubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        department: form.department.value,
        role: form.role.value
    };
    const errors = [];
    if (!data.firstName) errors.push("First name is required.");
    if (!data.lastName) errors.push("Last name is required.");
    if (!/\S+@\S+\.\S+/.test(data.email)) errors.push("A valid email is required.");
    if (!data.department) errors.push("Department is required.");
    if (!data.role) errors.push("Role is required.");
    if (errors.length) {
        document.getElementById('formErrors').textContent = errors.join(' ');
        return;
    }
    if (editingId) {
        const idx = employees.findIndex(emp => emp.id === editingId);
        employees[idx] = { ...employees[idx], ...data };
    } else {
        const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        employees.push({ id: newId, ...data });
    }
    closeModal();
    renderEmployees();
};

document.getElementById('sortBy').onchange = function(e) {
    sortBy = e.target.value;
    renderEmployees();
};
document.getElementById('perPage').onchange = function(e) {
    perPage = Number(e.target.value);
    currentPage = 1;
    renderEmployees();
};
document.getElementById('pagination').onclick = function(e) {
    if (e.target.tagName === 'BUTTON') {
        currentPage = Number(e.target.dataset.page);
        renderEmployees();
    }
};
document.getElementById('searchInput').oninput = function(e) {
    search = e.target.value.trim().toLowerCase();
    currentPage = 1;
    renderEmployees();
};


renderEmployees();
