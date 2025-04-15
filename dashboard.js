$(document).ready(function() {
    window.showSection = function(section) {
        $('.section').hide();
        $(`#${section}-section`).show();
        if (section === 'billing') loadBilling(); // From billing.js
        if (section === 'customers') loadCustomers();
        if (section === 'stock') loadStock(); // From stock.js
        if (section === 'categories') loadCategories();
        if (section === 'sales') loadSalesReport();
    };

    function loadCustomers() {
        $.ajax({
            url: 'get_customers.php',
            type: 'GET',
            success: function(response) {
                let customers = JSON.parse(response);
                let list = $('#customer-list').empty();
                customers.forEach(customer => {
                    list.append(`
                        <div class="bill-item">
                            <span>${customer.name} - ${customer.phone}</span>
                            <button class="delete-btn" onclick="deleteCustomer(${customer.id})">Delete</button>
                        </div>
                    `);
                });
            }
        });
    }

    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        let customer = {
            name: $('#customer-name').val(),
            phone: $('#customer-phone').val()
        };
        $.ajax({
            url: 'add_customer.php',
            type: 'POST',
            data: customer,
            success: function() {
                alert('Customer added successfully!');
                this.reset();
                loadCustomers();
            }
        });
    });

    window.addCustomerFromBilling = function() {
        let name = $('#customer-name-billing').val();
        let phone = $('#customer-phone-billing').val();
        if (name && phone) {
            $.ajax({
                url: 'add_customer.php',
                type: 'POST',
                data: { name: name, phone: phone },
                success: function() {
                    alert('Customer added!');
                    $('#customer-name-billing').val('');
                    $('#customer-phone-billing').val('');
                    loadBilling(); // Refresh customer list
                }
            });
        } else {
            alert('Please enter name and phone!');
        }
    };

    window.deleteCustomer = function(id) {
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: 'delete_customer.php',
                type: 'POST',
                data: { id: id },
                success: function() {
                    alert('Customer deleted!');
                    loadCustomers();
                }
            });
        }
    };

    function loadCategories() {
        $.ajax({
            url: 'get_categories.php',
            type: 'GET',
            success: function(response) {
                let categories = JSON.parse(response);
                let list = $('#category-list').empty();
                categories.forEach(category => {
                    list.append(`
                        <div class="bill-item">
                            <span>${category}</span>
                            <button class="delete-btn" onclick="deleteCategory('${category}')">Delete</button>
                        </div>
                    `);
                });
            }
        });
    }

    $('#categoryForm').on('submit', function(e) {
        e.preventDefault();
        let category = { name: $('#category-name').val() };
        $.ajax({
            url: 'add_category.php',
            type: 'POST',
            data: category,
            success: function() {
                alert('Category added successfully!');
                this.reset();
                loadCategories();
            }
        });
    });

    window.deleteCategory = function(name) {
        if (confirm('Are you sure you want to delete this category?')) {
            $.ajax({
                url: 'delete_category.php',
                type: 'POST',
                data: { name: name },
                success: function() {
                    alert('Category deleted!');
                    loadCategories();
                }
            });
        }
    };

    function loadSalesReport() {
        $.ajax({
            url: 'get_sales.php',
            type: 'GET',
            success: function(response) {
                let sales = JSON.parse(response);
                let report = $('#sales-report').empty();
                sales.forEach(sale => {
                    report.append(`<div>Sale ID: ${sale.id}, Total: ৳${sale.total}, Date: ${sale.date}</div>`);
                });
            }
        });
    }

    window.exportSalesToPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Sales Report", 10, 10);
        $.ajax({
            url: 'get_sales.php',
            type: 'GET',
            success: function(response) {
                let sales = JSON.parse(response);
                let y = 20;
                sales.forEach(sale => {
                    doc.text(`Sale ID: ${sale.id}, Total: ৳${sale.total}, Date: ${sale.date}`, 10, y);
                    y += 10;
                });
                doc.save('sales_report.pdf');
            }
        });
    };

    $('#profit-period').on('change', function() {
        let period = $(this).val();
        $.ajax({
            url: 'get_profit_loss.php',
            type: 'GET',
            data: { period: period },
            success: function(response) {
                let data = JSON.parse(response);
                $('#profit-report').html(`Profit/Loss: ৳${data.profit_loss}`);
            }
        });
    });

    window.exportProfitToPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let period = $('#profit-period').val();
        doc.text(`Profit/Loss Report (${period})`, 10, 10);
        $.ajax({
            url: 'get_profit_loss.php',
            type: 'GET',
            data: { period: period },
            success: function(response) {
                let data = JSON.parse(response);
                doc.text(`Profit/Loss: ৳${data.profit_loss}`, 10, 20);
                doc.save('profit_loss_report.pdf');
            }
        });
    };

    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        let user = {
            name: $('#user-name').val(),
            role: $('#user-role').val(),
            password: $('#user-password').val()
        };
        $.ajax({
            url: 'add_user.php',
            type: 'POST',
            data: user,
            success: function() {
                alert('User added successfully!');
                this.reset();
            }
        });
    });
});