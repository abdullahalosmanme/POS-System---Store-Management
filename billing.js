let billItems = [];

function loadBilling() {
    $.ajax({
        url: 'get_categories.php',
        type: 'GET',
        success: function(response) {
            let categories = JSON.parse(response);
            let categoryList = $('#categories').empty().append('<h2>Categories</h2>');
            categories.forEach(category => {
                categoryList.append(`<div class="category-item" data-category="${category}">${category}</div>`);
            });
        }
    });

    loadItems();
    updateBill();

    $('#categories').on('click', '.category-item', function() {
        let category = $(this).data('category');
        loadItems(category);
    });

    $('#items').on('click', '.item-card', function() {
        let item = {
            id: $(this).data('id'),
            name: $(this).data('name'),
            price: $(this).data('price')
        };
        billItems.push(item);
        updateBill();
    });

    $.ajax({
        url: 'get_customers.php',
        type: 'GET',
        success: function(response) {
            let customers = JSON.parse(response);
            let select = $('#customer-select').empty().append('<option value="">-- Select Customer --</option>');
            customers.forEach(customer => {
                select.append(`<option value="${customer.id}">${customer.name} (${customer.phone})</option>`);
            });
        }
    });
}

function loadItems(category = null) {
    $.ajax({
        url: 'get_items.php',
        type: 'GET',
        data: category ? { category: category } : {},
        success: function(response) {
            let items = JSON.parse(response);
            let itemList = $('#items').empty().append('<h2>Items</h2>');
            items.forEach(item => {
                itemList.append(`
                    <div class="item-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                        <img src="${item.image_path}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 5px; margin-right: 10px;">
                        <div>${item.name} - ৳${item.price}</div>
                    </div>
                `);
            });
        }
    });
}

function updateBill() {
    let billList = $('#bill').empty().append('<h2>Bill</h2>');
    billItems.forEach(item => {
        billList.append(`
            <div class="bill-item">
                <span>${item.name}</span>
                <span>৳${item.price}</span>
            </div>
        `);
    });
    let total = billItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    billList.append(`
        <div class="bill-item total-price">
            <span>Total</span>
            <span>৳${total.toFixed(2)}</span>
        </div>
        <button id="checkout-btn" class="checkout-btn">Checkout</button>
    `);

    $('#checkout-btn').on('click', function() {
        if (billItems.length === 0) {
            alert('No items in the bill.');
            return;
        }
        let customerId = $('#customer-select').val();
        $.ajax({
            url: 'save_sale.php',
            type: 'POST',
            data: { items: JSON.stringify(billItems), customer_id: customerId },
            success: function() {
                let invoice = generateInvoice();
                const printWindow = window.open('', '_blank');
                printWindow.document.write(invoice);
                printWindow.print();
                printWindow.close();
                billItems = [];
                updateBill();
            }
        });
    });
}

function generateInvoice() {
    let total = billItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    return `
        <html>
        <head><title>Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice { width: 100%; max-width: 600px; margin: auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; }
            .header p { font-size: 14px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f4f4f4; }
            .total { font-weight: bold; font-size: 16px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #555; }
        </style>
        </head>
        <body>
            <div class="invoice">
                <div class="header">
                    <h1>Invoice</h1>
                    <p>Developed By Osman, Obaidullah & Rahat</p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                </div>
                <table>
                    <thead><tr><th>Item Name</th><th>Price (৳)</th></tr></thead>
                    <tbody>${billItems.map(item => `<tr><td>${item.name}</td><td>৳${item.price}</td></tr>`).join('')}</tbody>
                </table>
                <div class="total">Total: ৳${total.toFixed(2)}</div>
                <div class="footer">Thank you!</div>
            </div>
        </body>
        </html>
    `;
}