$(document).ready(function() {
    let currBal = getBalance();
    $("#currBal").val(currBal);
    $("#formbuilder-0").hide();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    goTransaction();
    return true;
    /*
    let amtDiv = document.getElementById("amount");
    //amtDiv.style.visibility("visible");
    if ((amtDiv.style.visibility === 'hidden') || (amtDiv.style.visibility === '')) {
        amtDiv.style.visibility = 'visible';
        let bal = getBalance();
        document.getElementById("balance").value = bal;
    } else {
        amtDiv.style.visibility = 'hidden';
    }
    */
}

function goTransaction() {
    let amtDiv = document.getElementById("amount");
    $("#drop1").hide();
    $("#formbuilder-0").show();
}

function getBalance() {
    let balance = localStorage.getItem('balance');
    if (!balance) {
        balance = 800;
    }
    return parseFloat(balance);
}

function saveBalance() {
    let bal = getBalance();
    let spendAmt = document.getElementById("spend").value;
    let trans = bal - spendAmt;
    localStorage.setItem("balance", trans);
}

class boc_transaction {
    constructor() {
        this.name = name;
        this.year = year;
    }
    balance() {
        let balance = localStorage.getItem('balance');
        if (!balance) {
            balance = 800;
        }
        return parseFloat(balance);
    }
}