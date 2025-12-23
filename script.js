// fetch all divs
const row2 = document.querySelector(".row-2");
const row3 = document.querySelector(".row-3");
const row5 = document.querySelector(".row-5");
const row6 = document.querySelector(".row-6");

// fetch all controls
const username = document.getElementById("username");
const password = document.getElementById("password");
const grantType = document.getElementById("grantType");
const apiType = document.getElementById("apiType");
const resType = document.getElementById("resType");
const search = document.getElementById("search");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const singleDate = document.getElementById("date");
const loginResponse = document.getElementById("login-response");

const apiResponseBox = document.querySelector(".api-response");
const dataTable = document.querySelector(".data-table");
const thead = dataTable.querySelector("thead");
const tbody = dataTable.querySelector("tbody");

// all buttons
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const btnFetch = document.getElementById("btn-fetch");

var access_token = "";
var authInputs = {};
var apiInputs = {};

[row2, row3, row5, row6].forEach(r => r.style.display = "none");

const clearAll = () => {
    access_token = "";
    loginResponse.value = "";
    btnLogin.style.cursor = "pointer";
    btnLogout.style.cursor = "not-allowed";
    btnFetch.style.cursor = "not-allowed";
    btnLogin.style.opacity = 1;
    btnLogout.style.opacity = 0.5;
    btnFetch.style.opacity = 0.5;
}
clearAll();

// apiType change then hide/show of divs
apiType.addEventListener("change", function () {
    // Hide everything first and if needed disply flex
    [row2, row3, row5, row6].forEach(r => r.style.display = "none");

    switch (apiType.value) {
        case "announcement-list":
            row2.style.display = row5.style.display = "flex";
            break;
        case "rslt-list-date":
        case "nav-behavcopy":
            row3.style.display = "flex";
            break;
        case "announcement-for-companies":
            row2.style.display = row5.style.display = row6.style.display = "flex";
            break;
        case "yearly-return":
            row2.style.display = "flex";
            break;
        default:
            break;
    }
});

// store auth inputs data in object
const fetchAuthInputs = () => {
    authInputs = {
        username: username.value,
        password: password.value,
        grant_type: grantType.value
    }
}

// store all api inputs data in object
const fetchApiInputs = () => {
    apiInputs = {
        apiType: apiType.value,
        resType: resType.value,
        search: search.value,
        fromDate: fromDate.value,
        toDate: toDate.value,
        date: singleDate.value
    };
};

const login = async () => {
    const authdata = new URLSearchParams(authInputs).toString();

    const res = await fetch("https://auth.truedata.in/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: authdata
    })

    const data = await res.json();
    access_token = data.access_token || "";
    loginResponse.value = access_token ? "Token Granted" : `Error: ${JSON.stringify(data)}`;
    btnLogin.style.cursor = "not-allowed";
    btnLogin.style.opacity = 0.5;
    btnLogout.style.cursor = "pointer";
    btnLogout.style.opacity = 1;
    btnFetch.style.cursor = "pointer";
    btnFetch.style.opacity = 1;
}

const fetchApiData = async () => {
    try {
        const res = await fetch(
            `https://corporate.truedata.in/${apiInputs.apiType}?response=${apiInputs.resType}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": apiInputs.resType === "csv"
                        ? "text/csv"
                        : "application/json"
                }
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
        }

        if (apiInputs.resType === "csv") {
            const csvText = await res.text();
            const lines = csvText.split('\n');
            if (lines.length === 0) return; thead.innerHTML = "";

            // Header Setup 
            const headers = lines[0].split(',');
            const tr = document.createElement("tr");
            headers.map(key => {
                const th = document.createElement("th");
                th.textContent = key; tr.appendChild(th);
            });
            thead.appendChild(tr);

            // Data Setup 
            lines.slice(1).forEach(line => {
                const values = line.split(",");
                const tr = document.createElement("tr"); headers.forEach((_, idx) => {
                    const td = document.createElement("td");
                    td.textContent = values[idx]?.trim() || "-"; tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        } else {
            const jsonData = await res.json();
            thead.innerHTML = `<tr>
                            <th>Id</th>
                            <th>Descriptors</th>
                            <th>Categories</th>
                        <tr>`;
            jsonData.Records.map(row => {
                const tr = document.createElement("tr");
                row.map(data => {
                    const td = document.createElement("td");
                    td.textContent = data ?? "-";
                    tr.appendChild(td);
                })
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error("API Error:", error.message);
    }
};


btnLogin.addEventListener('click', () => {
    fetchAuthInputs();
    login();
});

btnLogout.addEventListener('click', () => {
    clearAll();
});

btnFetch.addEventListener('click', () => {
    fetchApiInputs();
    access_token !== "" ? fetchApiData() : alert("Unauthorised Access!");
});