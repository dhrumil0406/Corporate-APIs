// fetch all divs
const row2 = document.querySelector(".row-2");
const row3 = document.querySelector(".row-3");
const fromToDate = document.querySelector(".from-to-date");

// fetch all controls
const username = document.getElementById("username");
const password = document.getElementById("password");
const grantType = document.getElementById("grantType");
const apiType = document.getElementById("apiType");
const resType = document.getElementById("resType");
const search = document.getElementById("search");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const navDate = document.getElementById("navDate");
const loginResponse = document.getElementById("login-response");
const apiResponse = document.querySelector(".api-response");

// all buttons
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const btnFetch = document.getElementById("btn-fetch");

var authInputs;
var apiInputs;

row2.style.display = "none";
row3.style.display = "none";

// apiType change then hide/show of divs
apiType.addEventListener("change", function () {
    // Hide everything first and if needed disply flex
    row2.style.display = "none";
    row3.style.display = "none";
    fromToDate.style.display = "none";

    const selectedValue = apiType.value;

    // 4th opt NAV History
    if (selectedValue === "nav-history") {
        row2.style.display = "flex";
        fromToDate.style.display = "flex";
    }

    // 5th opt Yearly Return By Scheme
    else if (selectedValue === "yearly-return") {
        row2.style.display = "flex";
        fromToDate.style.display = "none";
    }

    // 6th opt Daily NAV Bhavcopy
    else if (selectedValue === "nav-behavcopy") {
        row3.style.display = "flex";
    }
});

// store auth inputs data in object
const fetchAuthInputs = () => {
    authInputs = {
        username: username.value,
        password: password.value,
        grantType: grantType.value
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
        navDate: navDate.value
    };
    apiResponse.innerText = "data";
    console.log("Fetched controls data:", apiInputs);
};

const makeConnection = () => {
    const authdata = new URLSearchParams();
    authdata.append("username", authInputs.username);
    authdata.append("password", authInputs.password);
    authdata.append("grant_type", authInputs.grantType);

    console.log(authdata.toString());

    fetch("https://auth.truedata.in/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: authdata.toString()
    })
        .then(res => res.json())
        .then((res) => {
            if (res.access_token) {
                loginResponse.value = "Token Granted!"
            }
            if (res.error) {
                loginResponse.value = "Error: " + JSON.stringify(res)
            }
        })
        .catch(error => console.log(error))
}

btnLogin.addEventListener('click', () => {
    fetchAuthInputs();
    makeConnection();
});

btnFetch.addEventListener('click', () => {
    fetchApiInputs();
});