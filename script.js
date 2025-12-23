// fetch all divs
const row2 = document.querySelector(".row-2");
const row3 = document.querySelector(".row-3");
const divtoprec = document.querySelector(".div-top-rec");

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
const topRec = document.getElementById("top");

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

const BASE_URL = "https://corporate.truedata.in";

[row2, row3, divtoprec].forEach(r => r.style.display = "none");

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

const clearFiledsValue = () => {
    search.value = "";
    fromDate.value = toDate.value = "";
    singleDate.value = topRec.value = "";
}

// apiType change then hide/show of divs
apiType.addEventListener("change", function () {
    // Hide everything first and if needed disply flex
    [row2, row3, divtoprec].forEach(r => r.style.display = "none");
    clearFiledsValue();

    switch (apiType.value) {
        case "announcements":
            row2.style.display = "flex";
            break;
        case "getResultList":
            row3.style.display = "flex";
            break;
        case "getannouncementsforcompanies":
            row2.style.display = divtoprec.style.display = "flex";
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
        date: singleDate.value,
        top: topRec.value,
    };
};

const formateDateTime = (date) => {
    // if (!date) return alert("Invalid date format...");
    const d = new Date(date);

    const yy = String(d.getFullYear()).slice(2);
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yy}${MM}${dd} 00:00:00`;
}

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

const callApi = async ({ apiInputs, query = {} }) => {
    const params = new URLSearchParams(query).toString();
    const api = `${BASE_URL}/${apiInputs.apiType}?${params}`;
    const res = await fetch(api,
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

    return apiInputs.resType === "csv"
        ? await res.text()
        : await res.json();
}

const csvToTable = (data) => {
    console.log(data);

    const lines = data.split('\n');
    if (lines.length === 0) return;

    // Header Setup 
    thead.innerHTML = "";
    const headers = lines[0].split(',');
    const tr = document.createElement("tr");
    headers.map(key => {
        const th = document.createElement("th");
        th.textContent = key;
        tr.appendChild(th);
    });
    thead.appendChild(tr);

    // Data Setup
    tbody.innerHTML = "";
    lines.slice(1).forEach(line => {
        const values = line.split(",");
        const tr = document.createElement("tr");
        headers.forEach((_, idx) => {
            const td = document.createElement("td");
            td.textContent = values[idx]?.trim() || "-"; tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

const jsonToTable = (data) => {
    console.log(data);
    // Header Setup
    thead.innerHTML = "";
    tbody.innerHTML = "";
    if (Array.isArray(data.Records[0])) {
        const tr = document.createElement("tr");
        data.Records[0].forEach((_, idx) => {
            const th = document.createElement("th");
            th.textContent = `Col ${idx + 1}`;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        // Data Setup
        data.Records.map(row => {
            const tr = document.createElement("tr");
            row.map(data => {
                const td = document.createElement("td");
                td.textContent = data ?? "-";
                tr.appendChild(td);
            })
            tbody.appendChild(tr);
        });
    } else {
        // Header Setup
        const tr = document.createElement("tr");
        for (const key in data.Records[0]) {
            const th = document.createElement("th");
            th.textContent = key;
            tr.appendChild(th);
        }
        thead.appendChild(tr);

        // Data Setup
        data.Records.map(row => {
            const tr = document.createElement("tr");
            for (const key in row) {
                const td = document.createElement("td");
                td.textContent = row[key] ?? "-";
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    }
}

const querySelection = (apiInputs) => {
    var query = {};
    switch (apiInputs.apiType) {
        case "getdescriptors":
            query = { response: apiInputs.resType }
            break;
        case "announcements":
            query = { response: apiInputs.resType, from: apiInputs.fromDate, to: apiInputs.toDate, symbol: apiInputs.search }
            break;
        case "getResultList":
            query = { response: apiInputs.resType, date: apiInputs.date }
            break;
        case "getannouncementsforcompanies":
            query = { response: apiInputs.resType, from: formateDateTime(apiInputs.fromDate), to: formateDateTime(apiInputs.toDate), symbol: apiType.search, top: apiInputs.top }
            break;
        case "yearly-return":
            row2.style.display = "flex";
            break;
        default:
            break;
    }
    return query;
}

const fetchApiData = async () => {
    try {
        const data = await callApi({ apiInputs, query: querySelection(apiInputs) });
        apiInputs.resType === 'csv' ? csvToTable(data) : jsonToTable(data);
    } catch (error) {
        console.log("API error: ", error);
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