const API_URL = 'http://localhost:5001/api/wallet';

async function updateWallet() {
    const response = await fetch(API_URL);
    const wallet = await response.json();
    let rows = '';
    for (const currency of wallet) {
        rows += `<tr>
                    <td>${currency.name}</td>
                    <td>${currency.count}</td>
                    <td>${currency.price}</td>
                  </tr>`;
    }
    document.getElementById('currency-table-body').innerHTML = rows;
}

async function sendTransaction(transaction) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(transaction),
    });
    return response.json();
}

// update wallet every 3 sec 
setInterval(updateWallet, 3000);

// render currencies
fetch(API_URL)
    .then((response) => response.json())
    .then((wallet) => {
        let rows = '';
        for (const currency of wallet) {
            if (currency.id !== 'rub') {
                rows += `<option value="${currency.id}">${currency.name} (${currency.symbol})</option>`;
            }
        }
        document.getElementById('currency').innerHTML = rows;
    });

document.getElementById('exchange-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var amount = parseFloat(document.getElementById('amount').value);
    var currency = document.getElementById('currency').value;
    var type = document.getElementById('type').value;
    // reset amout and error message box
    document.getElementById('amount').value = '';
    document.getElementById('message-value').innerHTML = '';
    const transaction = {
        currId: currency,
        type: type,
        count: amount,
    };
    sendTransaction(transaction).then((response) => {
        if (response.status === 'success') {
            updateWallet();
        } else {
            document.getElementById('message-value').innerHTML = response.reason;
        }
    });
});