function nextPage(numPage){
    let firstElementId = "page" + numPage
    numPage = numPage + 1
    let secondElementId = "page" + numPage
    document.getElementById(firstElementId).style.display = "none"
    document.getElementById(secondElementId).style.display = "inline"
}

function prevPage(numPage){
    let firstElementId = "page" + numPage
    numPage = numPage - 1
    let secondElementId = "page" + numPage
    document.getElementById(firstElementId).style.display = "none"
    document.getElementById(secondElementId).style.display = "inline"
}

function colorAndChange(n, k){
    let output = calculate(n, k);
    let elementId = n.toString() + k.toString();
    document.getElementById(elementId).style.backgroundColor = "#f5ad3c";
    document.getElementById(elementId).innerHTML = output.toString()
}

function changeBack(n, k){
    let elementId = n.toString() + k.toString()
    document.getElementById(elementId).style.backgroundColor = "#ffffff"
    let hiddenElement = n.toString() + k.toString() + "hidden";
    document.getElementById(elementId).innerHTML = document.getElementById(hiddenElement).innerHTML
}

function calculate(n, k) {
    var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}