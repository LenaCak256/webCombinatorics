function makeTable(num) {
    let id = "tbody" + num;
    let body = document.getElementById(id);

    for (let i = 1; i <= 10; i++) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdLabel = document.createElement("td");

        tdName.textContent = i + ". úloha - blablabla";
        tdName.style.border = "1px solid #20252d";
        tdLabel.style.border = "1px solid #20252d";
        tdLabel.style.backgroundColor = "rgba(182,174,174,0.79)";
        if (i === 1) {
            tdName.style.borderTop = "1px solid transparent";
            tdLabel.style.borderTop = "1px solid transparent";
        }
        if (i < 3) {
            tdLabel.style.backgroundColor = "#66a650";
            tdLabel.innerHTML = "<i class='fa fa-check'></i>";
        } else {
            tdLabel.textContent = "x";
        }

        tr.appendChild(tdName);
        tr.appendChild(tdLabel);
        body.appendChild(tr);
    }
}

