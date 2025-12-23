// fetch all divs
const row2 = document.querySelector(".row-2");
const divtoprec = document.querySelector(".div-top-rec");
const divfromdate = document.querySelector(".div-from-date");
const divtodate = document.querySelector(".div-to-date");

// fetch all controls
const username = document.getElementById("username");
const password = document.getElementById("password");
const grantType = document.getElementById("grantType");
const apiType = document.getElementById("apiType");
const search = document.getElementById("search");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const singleDate = document.getElementById("date");
const topRec = document.getElementById("top");

const nature = document.getElementById("nature");
const period = document.getElementById("period");
const type = document.getElementById("type");

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

[row2].forEach(r => r.style.display = "none");

const clearAll = () => {
    access_token = "";
    loginResponse.innerText = "";
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
    nature.value = period.value = type.value = "";
}

// apiType change then hide/show of divs
apiType.addEventListener("change", function () {
    // Hide everything first and if needed disply flex
    [row2, row2.children[0], row2.children[1], row2.children[2], row2.children[3], row2.children[4], row2.children[5], row2.children[6], row2.children[7]].forEach(r => r.style.display = "none");
    clearFiledsValue();

    switch (apiType.value) {
        case "announcements":
            row2.style.display = row2.children[0].style.display = row2.children[1].style.display = row2.children[2].style.display = "flex";
            break;
        case "getResultList":
            row2.style.display = row2.children[7].style.display = "flex";
            break;
        case "getannouncementsforcompanies":
            row2.style.display = row2.children[0].style.display = row2.children[1].style.display = row2.children[2].style.display = row2.children[3].style.display = "flex";
            break;
        case "getAllResultsByCompany":
            row2.style.display = row2.children[0].style.display = row2.children[4].style.display = row2.children[5].style.display = row2.children[6].style.display = "flex";
            // row2.children[1].style.display = row2.children[2].style.display = row2.children[3].style.display = "none";
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
        resType: 'csv',
        search: search.value,
        fromDate: fromDate.value,
        toDate: toDate.value,
        date: singleDate.value,
        top: topRec.value,
        nature: nature.value,
        period: period.value,
        type: type.value
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

const formatDate = (date) => {
    const d = new Date(date);

    const yy = String(d.getFullYear()).slice(2);
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yy}${MM}${dd}`;
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
    loginResponse.innerText = access_token ? "Token Granted!" : `Invalid Cradentials!`;
    if (access_token) {
        btnLogin.style.cursor = "not-allowed";
        btnLogin.style.opacity = 0.5;
        btnLogout.style.cursor = "pointer";
        btnLogout.style.opacity = 1;
        btnFetch.style.cursor = "pointer";
        btnFetch.style.opacity = 1;
    }

}

const callApi = async ({ apiInputs, query = {} }) => {
    const params = new URLSearchParams(query).toString();
    const api = `${BASE_URL}/${apiInputs.apiType}?${params}`;
    const res = await fetch(api,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Accept": "text/csv"
            }
        }
    );

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
    }

    return await res.text()
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
        case "getAllResultsByCompany":
            query = { response: apiInputs.resType, symbol: apiInputs.search, nature: apiInputs.nature, period: apiInputs.period, type: apiInputs.type }
            break;
        default:
            break;
    }
    return query;
}

const fetchApiData = async () => {
    try {
        const data = await callApi({ apiInputs, query: querySelection(apiInputs) });
        csvToTable(data);
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