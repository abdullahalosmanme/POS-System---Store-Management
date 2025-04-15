function loadStock() {
    $('#stockForm').on('submit', function(e) {
        e.preventDefault();
        let formData = new FormData(this);
        $.ajax({
            url: 'insert_stock.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                let result = JSON.parse(response);
                alert(result.status === 'success' ? 'Stock added!' : 'Error: ' + result.message);
                if (result.status === 'success') {
                    this.reset();
                    loadStockList();
                }
            }
        });
    });

    loadStockList();
}

function loadStockList() {
    $.ajax({
        url: 'get_items.php',
        type: 'GET',
        success: function(response) {
            let items = JSON.parse(response);
            let list = $('#stock-list').empty();
            items.forEach(item => {
                list.append(`
                    <div class="bill-item">
                        <span>${item.name} - ৳${item.price} (${item.category})</span>
                        <button class="delete-btn" onclick="deleteStock(${item.id})">Delete</button>
                    </div>
                `);
            });
        }
    });
}

window.deleteStock = function(id) {
    if (confirm('Are you sure you want to delete this stock item?')) {
        $.ajax({
            url: 'delete_stock.php',
            type: 'POST',
            data: { id: id },
            success: function() {
                alert('Stock deleted!');
                loadStockList();
            }
        });
    }
};