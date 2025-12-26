// fetch row2 for fileds
const row2 = document.querySelector(".row-2");

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

const id = document.getElementById("id");
const segment = document.getElementById("segment");
const fromDateTime = document.getElementById("fromDateTime");
const toDateTime = document.getElementById("toDateTime");
const duringMarket = document.getElementById("duringMarket");

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
var defaultResType = "csv"; // default response in csv
//  when both then header from csv and body from json
//  when 
var tableResType = "both";

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
};
clearAll();

const clearFiledsValue = () => {
    search.value = "";
    fromDate.value = toDate.value = "";
    singleDate.value = topRec.value = "";
    nature.value = period.value = type.value = "";
    segment.value = id.value = "";
    fromDateTime.value = toDateTime.value = "";
    duringMarket.checked = false;
};

apiType.addEventListener("change", function () {
    row2.children[0].children[0].innerText = "Search Symbol:";
    [row2, ...row2.children].forEach(r => r.style.display = "none");
    clearFiledsValue();
    defaultResType = "csv";
    tableResType = "both";

    switch (apiType.value) {
        case "announcements":
        case "getNewsForDateRange":
            row2.style.display = "flex";
            Array.from(row2.children).slice(0, 3).forEach(c => c.style.display = "flex");
            break;
        case "getResultList":
        case "getSHPListByDate":
            row2.style.display = row2.children[7].style.display = "flex";
            defaultResType = "json";
            tableResType = "jsonOnly";
            break;
        case "getannouncementsforcompanies":
            row2.style.display = "flex";
            Array.from(row2.children).slice(0, 4).forEach(c => c.style.display = "flex");
            row2.children[0].children[0].innerText = "Search Symbols:";
            break;
        case "getAllResultsByCompany":
            row2.style.display = row2.children[0].style.display = "flex";
            Array.from(row2.children).slice(4, 7).forEach(c => c.style.display = "flex");
            defaultResType = "json";
            tableResType = "jsonOnly";
            break;
        case "getMarketCap":
        case "getSymbolClassificationBulk":
            row2.style.display = row2.children[0].style.display = "flex";
            row2.children[0].children[0].innerText = "Search Symbols:";
            defaultResType = "json";
            tableResType = "jsonOnly";
            break;
        case "getchartdata":
            row2.style.display = row2.children[0].style.display = row2.children[4].style.display = "flex";
            break;
        case "getratiosForsymbol":
        case "getSHPListByCompany":
        case "getSymbolClassification":
        case "getMarketCapHistory":
            row2.style.display = row2.children[0].style.display = "flex";
            defaultResType = "json";
            tableResType = "jsonOnly";
            break;
        case "getfiidiidata":
            row2.style.display = row2.children[7].style.display = row2.children[9].style.display = "flex";
            break;
        case "getresultcalendar":
            defaultResType = "json";
            tableResType = "jsonOnly";
            break;
        case "getPeerCompanies":
        case "getChartDataWithPE":
            row2.style.display = row2.children[0].style.display = "flex";
            break;
        case "getannouncementsforcompaniesrange":
            row2.style.display = row2.children[1].style.display = row2.children[2].style.display = row2.children[3].style.display = row2.children[12].style.display = "flex";
            break;
        default: break;
    }
});

const fetchAuthInputs = () => {
    authInputs = {
        username: username.value,
        password: password.value,
        grant_type: grantType.value
    };
};

const fetchApiInputs = () => {
    apiInputs = {
        apiType: apiType.value,
        resType: defaultResType,
        search: search.value,
        fromDate: fromDate.value,
        toDate: toDate.value,
        date: singleDate.value,
        top: topRec.value,
        nature: nature.value,
        period: period.value,
        type: type.value,
        id: id.value,
        segment: segment.value,
        fromDateTime: fromDateTime.value,
        toDateTime: toDateTime.value,
        duringMarket: duringMarket.checked
    };
};

const formateDateTime = (date) => {
    const d = new Date(date);
    return `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")} 00:00:00`;
};

const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};

// ================= LOGIN =================
const login = async () => {
    const authdata = new URLSearchParams(authInputs).toString();

    const res = await fetch("https://auth.truedata.in/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: authdata
    });

    const data = await res.json();
    access_token = data.access_token || "";
    loginResponse.innerText = access_token ? "Token Granted!" : "Invalid Credentials!";

    if (access_token) {
        btnLogin.style.cursor = "not-allowed";
        btnLogin.style.opacity = 0.5;
        btnLogout.style.cursor = "pointer";
        btnLogout.style.opacity = 1;
        btnFetch.style.cursor = "pointer";
        btnFetch.style.opacity = 1;
    }
};

// ================= API CALL =================
var api = "";
const callApi = async ({ apiInputs, query }) => {
    const params = new URLSearchParams(query).toString();
    api = `${BASE_URL}/${apiInputs.apiType}?${params}`;

    const res = await fetch(api, {
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Accept": apiInputs.resType === "csv" ? "text/csv" : "application/json"
        }
    });

    if (!res.ok) throw new Error(res.status);

    return apiInputs.resType === "csv" ? res.text() : res.json();
};

// CSV HEADER + JSON BODY STARTS

// CSV → Header only
const isFloat = (val) => {
    return typeof val === "number";
};
const extractCsvHeaders = (csv) =>
    csv.split("\n")[0].split(",").map(h => h.trim());

// render header to table
const renderTableHeader = (headers) => {
    thead.innerHTML = "";
    const tr = document.createElement("tr");
    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
};

// JSON → Body
const renderTableBodyFromJson = (jsonData) => {
    tbody.innerHTML = "";
    console.log(jsonData);
    if (jsonData.Records === '' || jsonData.Records.length === 0) {
        thead.innerHTML = "";
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = jsonData.status !== 'Success' && jsonData.status || "No data exists! ";
        tr.appendChild(th);
        thead.appendChild(tr);
    }

    // response is [[],[],[]]
    const rows = jsonData.Records || [];

    // check rows array has array or not
    if (Array.isArray(rows[0])) {
        rows.forEach(row => {
            const tr = document.createElement("tr");
            row.forEach((_, idx) => {
                const td = document.createElement("td");
                td.textContent = row[idx] || "-";
                if (isFloat(row[idx] ?? "-")) {
                    td.style.textAlign = "right";
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        rows.forEach((_, idx) => {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = rows[idx] || "-";
            if (isFloat(rows[idx] ?? "-")) {
                td.style.textAlign = "right";
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
    }
};

// CSV HEADER + JSON BODY END

// Both HEADER & BODY WITH JSON

const jsonToTable = (data) => {
    // console.log(data);
    // Header Setup
    thead.innerHTML = "";
    tbody.innerHTML = "";
    if (data.Records === '' || data.Records.length === 0) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = data.status !== 'Success' && data.status || "No data exists! ";
        tr.appendChild(th);
        thead.appendChild(tr);
    }
    console.log(data);

    // Header Setup
    if (data.Records.length >= 1) {
        // response is [{}, {}, {}]
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
                if (isFloat(row[key] ?? "-")) {
                    td.style.textAlign = "right";
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    }
    else {
        // response is {} has only single onject
        const tr = document.createElement("tr");

        for (const key in data.Records) {
            const th = document.createElement("th");
            th.textContent = key;
            tr.appendChild(th);
        }
        thead.appendChild(tr);

        const trBody = document.createElement("tr");
        for (const key in data.Records) {
            const td = document.createElement("td");
            td.textContent = data.Records[key] ?? "-";
            if (isFloat(data.Records[key] ?? "-")) {
                td.style.textAlign = "right";
            }
            trBody.appendChild(td);
        }
        tbody.appendChild(trBody);
    }
}

const querySelection = (apiInputs) => {
    switch (apiInputs.apiType) {
        case "getdescriptors":
        case "getShpMemberTypes":
        case "getresultcalendar":
            return { response: apiInputs.resType };
        case "announcements":
            return { response: apiInputs.resType, from: formatDate(apiInputs.fromDate), to: formatDate(apiInputs.toDate), symbol: apiInputs.search };
        case "getResultList":
        case "getSHPListByDate":
            return { response: apiInputs.resType, date: apiInputs.date };
        case "getannouncementsforcompanies":
            return { response: apiInputs.resType, from: formateDateTime(apiInputs.fromDate), to: formateDateTime(apiInputs.toDate), symbols: apiInputs.search, top: apiInputs.top };
        case "getAllResultsByCompany":
            return { response: apiInputs.resType, symbol: apiInputs.search, nature: apiInputs.nature, period: apiInputs.period, type: apiInputs.type };
        case "getMarketCap":
        case "getSymbolClassificationBulk":
            return { response: apiInputs.resType, symbols: apiInputs.search };
        case "getchartdata":
            return { response: apiInputs.resType, symbol: apiInputs.search, nature: apiInputs.nature };
        case "getratiosForsymbol":
        case "getSHPListByCompany":
        case "getSymbolClassification":
        case "getPeerCompanies":
        case "getChartDataWithPE":
        case "getMarketCapHistory":
            return { response: apiInputs.resType, symbol: apiInputs.search };
        case "getfiidiidata":
            return { response: apiInputs.resType, date: formatDate(apiInputs.date), segment: apiInputs.segment };
        case "getNewsForDateRange":
            return { response: apiInputs.resType, from: formateDateTime(apiInputs.fromDate), to: formateDateTime(apiInputs.toDate), symbol: apiInputs.search };
        case "getannouncementsforcompaniesrange":
            return { response: apiInputs.resType, from: formateDateTime(apiInputs.fromDate), to: formateDateTime(apiInputs.toDate), top: apiInputs.top, duringmarket: apiInputs.duringMarket }
        default:
            return {};
    }
};

const fetchApiData = async () => {
    try {
        if (tableResType === "both") {
            // CSV → HEADER
            const csvInputs = { ...apiInputs, resType: 'csv' };
            const csvRes = await callApi({
                apiInputs: csvInputs,
                query: querySelection(csvInputs)
            });
            const headers = extractCsvHeaders(csvRes);

            // JSON → BODY
            const jsonInputs = { ...apiInputs, resType: 'json' };
            const jsonRes = await callApi({
                apiInputs: jsonInputs,
                query: querySelection(jsonInputs)
            });

            renderTableHeader(headers);
            renderTableBodyFromJson(jsonRes, headers);
        } else {
            const jsonRes = await callApi({ apiInputs, query: querySelection(apiInputs) });
            apiInputs.resType === 'json' && jsonToTable(jsonRes);
        }
        // document.querySelector(".response-title span").innerText = `[Api Request: ${api}]`;
    } catch (err) {
        console.error("API error:", err);
    }
};

btnLogin.addEventListener("click", () => {
    fetchAuthInputs();
    login();
});

btnLogout.addEventListener("click", clearAll);

btnFetch.addEventListener("click", () => {
    fetchApiInputs();
    access_token ? fetchApiData() : alert("Unauthorised Access!");
});
