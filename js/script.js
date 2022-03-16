
let data = []; 

const employeeData = {
    id: "",
    firstName: "",
    lastName: ""
};

let nextPage;
let lastPage;
let firstPage = 0;


let editEmployee = true; 
const defaultPath = "http://localhost:8080";

$(document).ready(function () {
    getData(); 

   
    if(localStorage.getItem("currentPage") === null){
        localStorage.setItem("currentPage", 0);
    }

    
    $("body").on("click", ".employee-delete-button", function () {
        id = $(this).parent("td").data("id");
        deleteEmployee(id);
    });

    
    $("body").on("click", "#trigger-modal-button", function () {
        $("#employee-submit-button").removeAttr("hidden");
        $("#employee-edit-button").attr("hidden", "hidden");
        editEmployee = false;  
    });

    
    $("body").on("click", ".employee-edit-button", function () {
        id = $(this).parent("td").data("id"); 
        $("#employee-edit-button").removeAttr("hidden");
        $("#employee-submit-button").attr("hidden", "hidden");
        getEmployeeData(id); 
        editEmployee = true; 

    });

    
    $("#employee-form").submit(function (e) {
        e.preventDefault();
        if (!editEmployee) {
            getFormEmployeeData();
            createEmployee();
        }
        else {
            getFormEmployeeData();
            editEmployeePUT();
        }
    });

    $("body").on("click", ".page-item", function () {
        localStorage.setItem("currentPage", $(this).data('page'));
        getData();
    });
});
function displayEmployeeList() {
    let rows = '';
    $.each(data, function (index, value) {
        rows += '<tr>';
        rows += '<td>' + value.id + '</td>';
        rows += '<td>' + value.firstName + '</td>';
        rows += '<td>' + value.lastName + '</td>';
        rows += '<td data-id="' + value.id + '">';
        rows += '<button class="btn btn-success employee-edit-button me-2" data-bs-toggle="modal" data-bs-target="#employee-modal" data-bs-event="@addEmployee"><i class="fa-solid fa-pen"></i></button>';
        rows += '<button class="btn btn-danger employee-delete-button"><i class="fa-solid fa-trash-can"></i></button>';
        rows += '</td>';
        rows += '</td>';
    });
    $("tbody").html(rows);
}
function getData() {
    $.ajax({
            method: "GET",
            url: `http://localhost:8080/employees?page=${parseInt(localStorage.getItem("currentPage"))}&size=${5}`
        })
        .done(function (msg) {
            data = msg['_embedded']['employees'];
            totalPages = msg['page']['totalPages'];
       
            if (parseInt(localStorage.getItem("currentPage")) > (totalPages-1)) {
                nextPage = msg['_links']['next']['href'];
            }
            displayEmployeeList(); 
            displayPagination(); 
        });
}
function getEmployeeData(id) {
    $.ajax({
            method: "GET",
            url: `${defaultPath}/employees/${id}`
        })
        .done(function (msg) {
            employeeData.id = msg.id;
            employeeData.firstName = msg.firstName;
            employeeData.lastName = msg.lastName;
            setFormEmployeeData();
        });
}
function createEmployee() {
    $.ajax({
            method: "POST",
            url: `${defaultPath}/employees`,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(employeeData)
        })
        .done(function (msg) {
            location.reload();
        });
}
function deleteEmployee(id) {
    $.ajax({
            method: "DELETE",
            url: `${defaultPath}/employees/${id}`
        })
        .done(function () {
            getData();
            displayEmployeeList();
        });
}
function editEmployeePUT() {
    $.ajax({
            method: "PUT",
            url: `${defaultPath}/employees/${employeeData.id}`,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(employeeData)
        })
        .done(function (msg) {
            location.reload();
        });
}
function setFormEmployeeData() {
    $('#employee-name').val(employeeData.firstName);
    $('#employee-last-name').val(employeeData.lastName);
}
function getFormEmployeeData() {
    employeeData.firstName = $('#employee-name').val();
    employeeData.lastName = $('#employee-last-name').val();
}
function displayPagination() {
    let code = '';
    let dataPage = parseInt(localStorage.getItem("currentPage"));

    code += '<nav>';
    code += '<ul class="pagination justify-content-center">';
    if (parseInt(localStorage.getItem("currentPage")) === 0) {
        code += '<li class="disabled me-2"> ' +
            '<a class="page-link no-select" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span></a></li>';
    } else {
        code += '<li class="page-item me-2" data-page="' + (parseInt(localStorage.getItem("currentPage")) - 1) + '"> ' +
            '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span></a></li>';
    }

   
    if (parseInt(localStorage.getItem("currentPage")) >= 2) {
        code += '<li class="page-item me-2" data-page="' + firstPage + '"><a class="page-link" href="#">' + (firstPage + 1) + '</a></li>'
        if (parseInt(localStorage.getItem("currentPage")) >= 3)
            code += '<li class="disabled me-2"><a class="page-link" >...</a></li>'
    }
    for (let dataPage = getNavigationStartPage();
        (parseInt(localStorage.getItem("currentPage")) != totalPages - 2) ? dataPage < parseInt(localStorage.getItem("currentPage")) + 2 : dataPage < parseInt(localStorage.getItem("currentPage")) + 1; dataPage++) {
        if (dataPage === parseInt(localStorage.getItem("currentPage"))) { 
            code += '<li class="page-item active me-2" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
        } else {
            code += '<li class="page-item me-2" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
        }

    }

    if (parseInt(localStorage.getItem("currentPage")) < totalPages - 4) {
        code += '<li class="disabled me-2"><a class="page-link" >...</a></li>'
        code += '<li class="page-item me-2" data-page="' + (totalPages - 2) + '"><a class="page-link" href="#">' + (totalPages + 1) + '</a></li>'
    }

    if (parseInt(localStorage.getItem("currentPage")) === totalPages-2) {
        code += '<li class="disabled me-2"> ' +
            '<a class="page-link no-select" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo</span></a></li>';
    } else {
        code += '<li class="page-item me-2" data-page="' + (parseInt(localStorage.getItem("currentPage")) + 1) + '"> ' +
            '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo</span></a></li>';
    }
    $("pagination").html(code);
}
function getNavigationStartPage() {

    if (parseInt(localStorage.getItem("currentPage")) === 0) {
        return parseInt(localStorage.getItem("currentPage"));
    } else {
        return parseInt(localStorage.getItem("currentPage")) - 1;
    }
}