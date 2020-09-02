document.getElementById("toolbar_logo").onclick = function () {
    location.reload(true);
};

const sources = {
    us: {
        "associated-press": "Associated Press",
        "bloomberg": "Bloomberg",
        "business-insider": "Business Insider",
        "cnbc": "CNBC",
        "cnn": "CNN",
        "entertainment-weekly": "Entertainment Weekly",
        "espn": "ESPN",
        "espn-cric-info": "ESPN Cric Info",
        "fortune": "Fortune",
        "fox-sports": "Fox Sports",
        "google-news": "Google News",
        "hacker-news": "Hacker News",
        "ign": "IGN",
        "mtv-news": "MTV News",
        "national-geographic": "National Geographic",
        "new-scientist": "New Scientist",
        "newsweek": "Newsweek",
        "new-york-magazine": "New York Magazine",
        "nfl-news": "NFL News",
        "techcrunch": "TechCrunch",
        "the-new-york-times": "The New York Times",
        "the-next-web": "The Next Web",
        "the-verge": "The Verge",
        "the-wall-street-journal": "The Wall Street Journal",
        "the-washington-post": "The Washington Post",
    },
    gb: {
        "bbc-news": "BBC News",
        "bbc-sport": "BBC Sport",
        "business-insider-uk": "Business Insider (UK)",
        "daily-mail": "Daily Mail",
        "financial-times": "Financial Times",
        "four-four-two": "FourFourTwo",
        "independent": "Independent",
        "mirror": "Mirror",
        "talksport": "TalkSport",
        "the-telegraph": "The Telegraph"
    },
    de: {
        "der-tagesspiegel": "Der Tagesspiegel",
        "die-zeit": "Die Zeit",
        "focus": "Focus",
        "gruenderszene": "Gruenderszene",
        "handelsblatt": "Handelsblatt",
        "spiegel-online": "Spiegel Online",
        "wired-de": "Wired.de",
        "wirtschafts-woche": "Wirtschafts Woche"
    }
};

let creator, current, animate;

const element = {
    content: document.getElementById("content"),
    offline: document.getElementById("offline"),
    toolbar: document.getElementById("toolbar"),
    blocker: document.getElementById("blocker"),
    drawer: document.getElementById("drawer"),
    toolbar_tabs: document.getElementById("toolbar_tabs")
};

const storage = {
    available: function () {
        try {
            localStorage.setItem("available", "available");
            localStorage.removeItem("available");
            return true;
        } catch (e) {
            return false;
        }
    },
    get: function (key) {
        try {
            return localStorage.getItem(key);
        } catch (e) { }
    },
    set: function (key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) { }
    }
};

let interval;
const left = document.getElementById("toolbar_left");
const right = document.getElementById("toolbar_right");

left.onpointerdown = function () {
    element.toolbar_tabs.scrollLeft -= 8;
    interval = setInterval(function () {
        element.toolbar_tabs.scrollLeft -= 8;
    }, 8);
};

right.onpointerdown = function () {
    element.toolbar_tabs.scrollLeft += 8;
    interval = setInterval(function () {
        element.toolbar_tabs.scrollLeft += 8;
    }, 8);
};

left.onpointerup = left.onpointerleave = left.onpointercancel = right.onpointerup = right.onpointerleave = right.onpointercancel = function () {
    clearInterval(interval);
};

element.content.ontouchstart = function (down) {
    element.content.ontouchmove = function (up) {
        const x = up.targetTouches[0].pageX - down.targetTouches[0].pageX;
        const y = up.targetTouches[0].pageY - down.targetTouches[0].pageY;

        if (y <= 40 && y >= -40) {
            if (x > 80) {
                if (current.previousSibling) {
                    current.previousSibling.click();
                    element.content.ontouchmove = null;
                };
            } else if (x < -80) {
                if (current.nextSibling) {
                    current.nextSibling.click();
                    element.content.ontouchmove = null;
                }
            }
        } else {
            element.content.ontouchmove = null;
        }
    };
};

document.onkeyup = function (event) {
    const key = event.which || event.keyCode || 0;
    if (key === 37 && current.previousSibling) current.previousSibling.click();
    if (key === 39 && current.nextSibling) current.nextSibling.click();
};

let down, move, open = false;

document.getElementById("toolbar_drawer").onclick = function () {
    open = true;
    element.drawer.scrollTop = 0;
    element.blocker.classList.add("active");
    element.drawer.classList.add("active");
};

document.getElementById("blocker").onclick = function () {
    open = false;
    element.blocker.classList.remove("active");
    element.drawer.classList.remove("active");
};

element.blocker.ontouchstart = function (event) {
    if (!open) element.drawer.scrollTop = 0;
    down = event.targetTouches[0].pageX;
    element.blocker.style.width = "100%";
};

element.blocker.ontouchmove = function (event) {
    if (event.changedTouches[0].identifier !== 0) return;
    move = event.targetTouches[0].pageX;
    let delta = Math.min(move, element.drawer.clientWidth);
    const opacity = (delta / element.drawer.clientWidth) * 0.3;

    element.drawer.style.transition = "none";
    element.drawer.style.transform = "translateX(" + delta + "px)";
    element.blocker.style.transition = "none";
    element.blocker.style.background = "rgba(0,0,0," + opacity + ")";
    event.preventDefault();
};

element.blocker.ontouchend = element.blocker.ontouchcancel = function (event) {
    if (event.changedTouches[0].identifier !== 0) return;
    element.blocker.style.width = null;
    element.drawer.style.transition = null;
    element.drawer.style.transform = null;
    element.blocker.style.transition = null;
    element.blocker.style.background = null;

    if (move > element.drawer.clientWidth * (open ? 0.75 : 0.25)) {
        open = true;
        element.blocker.classList.add("active");
        element.drawer.classList.add("active");
    } else {
        open = false;
        element.blocker.classList.remove("active");
        element.drawer.classList.remove("active");
    }
};

function renderSources(language) {
    const array = storage.get("excluded") ? JSON.parse(storage.get("excluded")) : [];

    while (element.drawer.lastChild.id !== "drawer_banner") {
        element.drawer.removeChild(element.drawer.lastChild);
    }

    Object.keys(sources[language]).forEach(function (key) {
        const item = document.createElement("div");
        item.className = "source";
        element.drawer.appendChild(item);

        creator = document.createElement("span");
        creator.innerText = sources[language][key];
        item.appendChild(creator);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        creator = document.createElementNS("http://www.w3.org/2000/svg", "path");
        creator.setAttributeNS(null, "d", "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z");
        svg.appendChild(creator);
        item.appendChild(svg);

        if (array.indexOf(key) >= 0) {
            svg.style.opacity = "0";
        }

        item.onclick = function () {
            if (!storage.available()) return;
            let array = storage.get("excluded") ? JSON.parse(storage.get("excluded")) : [];

            if (array.indexOf(key) < 0) {
                array.push(key);
                storage.set("excluded", JSON.stringify(array));
                svg.style.opacity = "0";
            } else {
                array.splice(array.indexOf(key), 1);
                storage.set("excluded", JSON.stringify(array));
                svg.style.opacity = "1";
            }
            renderTabs(language);
        };
    });

    renderTabs(language);
}

function renderTabs(language) {
    const array = storage.get("excluded") ? JSON.parse(storage.get("excluded")) : [];

    while (element.toolbar_tabs.firstChild) {
        element.toolbar_tabs.removeChild(element.toolbar_tabs.firstChild);
    }

    while (element.content.lastChild.id !== "offline") {
        element.content.removeChild(element.content.lastChild);
    }

    Object.keys(sources[language]).forEach(function (key) {
        if (array.indexOf(key) > -1) return;
        creator = document.createElement("span");
        creator.id = key;
        creator.innerText = sources[language][key];
        element.toolbar_tabs.appendChild(creator);
    });

    creator = document.createElement("div");
    creator.id = "toolbar_indicator";
    element.toolbar_tabs.appendChild(creator);

    const favorite = document.getElementById(storage.get("favorite"));
    animate = false;

    if (favorite) {
        favorite.click();
    } else {
        element.toolbar_tabs.firstChild.click();
    }
}

function requestArticles(source) {
    while (element.content.lastChild.id !== "offline") {
        element.content.removeChild(element.content.lastChild);
    }

    element.offline.classList.remove("active");
    element.content.classList.remove("active");

    if (!navigator.onLine) {
        const cache = JSON.parse(storage.get(source));
        if (cache) combineArticles(source, cache.latest, cache.top, cache.popular);
        element.offline.classList.add("active");
        element.content.classList.add("active");
        return;
    }

    let latest, top, popular;

    const request1 = new XMLHttpRequest();
    const request2 = new XMLHttpRequest();
    const request3 = new XMLHttpRequest();

    request1.responseType = request2.responseType = request3.responseType = "json";
    request1.open("GET", "https://newsapi.org/v1/articles?source=" + source + "&sortBy=latest&apiKey=e86b1265afc449e1aa6d2e2e676ebc39", true);
    request2.open("GET", "https://newsapi.org/v1/articles?source=" + source + "&sortBy=top&apiKey=e86b1265afc449e1aa6d2e2e676ebc39", true);
    request3.open("GET", "https://newsapi.org/v1/articles?source=" + source + "&sortBy=popular&apiKey=e86b1265afc449e1aa6d2e2e676ebc39", true);

    request1.onload = function () {
        latest = (request1.status === 200) ? request1.response.articles : true;
        combineArticles(source, latest, top, popular);
    }

    request2.onload = function () {
        top = (request2.status === 200) ? request2.response.articles : true;
        combineArticles(source, latest, top, popular);
    }

    request3.onload = function () {
        popular = (request3.status === 200) ? request3.response.articles : true;
        combineArticles(source, latest, top, popular);
    }

    request1.send();
    request2.send();
    request3.send();
}

function combineArticles(source, latest, top, popular) {
    if (!latest || !top || !popular) return;

    while (element.content.lastChild.id !== "offline") {
        element.content.removeChild(element.content.lastChild);
    }

    storage.set(source, JSON.stringify({
        latest: latest,
        top: top,
        popular: popular,
    }));

    if (latest !== true) {
        creator = document.createElement("div");
        creator.className = "title";
        creator.innerText = "Latest articles";
        element.content.appendChild(creator);

        for (let counter = 0; counter < latest.length; counter++) {
            renderArticle(latest[counter], counter + 1 === latest.length);
        }
    }

    if (top !== true) {
        creator = document.createElement("div");
        creator.className = "title";
        creator.innerText = "Top articles";
        element.content.appendChild(creator);

        for (let counter = 0; counter < top.length; counter++) {
            renderArticle(top[counter], counter + 1 === top.length);
        }
    }

    if (popular !== true) {
        creator = document.createElement("div");
        creator.className = "title";
        creator.innerText = "Popular articles";
        element.content.appendChild(creator);

        for (let counter = 0; counter < popular.length; counter++) {
            renderArticle(popular[counter], counter + 1 === popular.length);
        }
    }

    element.content.classList.add("active");
}

function renderArticle(article, last) {
    const item = document.createElement("div");
    item.className = "article";
    element.content.appendChild(item);

    item.onclick = function () {
        window.open(article.url);
    };

    if (article.urlToImage) {
        creator = document.createElement("img");
        creator.className = "article_image";
        creator.alt = article.title;
        creator.onload = function () {
            this.style.opacity = "1";
        };
        creator.onerror = function () {
            this.style.display = "none";
        };
        creator.src = "https://images.weserv.nl/?url=" + article.urlToImage.replace("https://", "").replace("http://", "") + "&w=400&h=200&t=squaredown";
        item.appendChild(creator);
    }

    creator = document.createElement("div");
    creator.className = "article_headline";
    creator.innerText = article.title;
    item.appendChild(creator);

    creator = document.createElement("div");
    creator.className = "article_description";
    creator.innerText = article.description || "Description not available.";
    item.appendChild(creator);

    const link = document.createElement("a");
    link.href = article.url;

    creator = document.createElement("div");
    creator.className = "article_information";
    item.appendChild(creator);

    if (article.publishedAt) {
        let minutes = Math.max(0, Math.ceil((new Date().getTime() - new Date(article.publishedAt).getTime()) / 60000));
        if (minutes < 60) {
            creator.innerText = minutes + ((minutes === 1) ? (" minute") : (" minutes"));
        } else if (minutes >= 60 && minutes < 1440) {
            minutes = Math.floor(minutes / 60);
            creator.innerText = minutes + ((minutes === 1) ? (" hour") : (" hours"));
        } else if (minutes >= 1440) {
            minutes = Math.floor(minutes / 1440);
            creator.innerText = minutes + ((minutes === 1) ? (" day") : (" days"));
        }
        creator.innerText += " ago on " + link.hostname.replace("www.", "");
    } else {
        creator.innerText = "On " + link.hostname.replace("www.", "");
    }

    if (last) {
        item.style.border = "none";
    }
}

element.toolbar_tabs.onclick = function (event) {
    if (event.target.tagName !== "SPAN") return;
    if (current) current.style.color = null;
    current = event.target;
    current.style.color = "var(--theme-title)";

    const toolbar_indicator = document.getElementById("toolbar_indicator");

    const scroll = current.offsetLeft - element.toolbar_tabs.scrollLeft - (element.toolbar_tabs.clientWidth / 2 - current.clientWidth / 2);
    const left = Math.max(scroll, -element.toolbar_tabs.scrollLeft);
    const right = Math.min(scroll, element.toolbar_tabs.scrollWidth - element.toolbar_tabs.clientWidth - element.toolbar_tabs.scrollLeft);

    const step_scroll = (scroll < 0 ? left : right) / 16;
    const step_width = (current.clientWidth - toolbar_indicator.clientWidth) / 16;
    const step_left = (current.offsetLeft - toolbar_indicator.offsetLeft) / 16;

    if (animate === false) {
        animate = undefined;
        element.toolbar_tabs.scrollLeft = current.offsetLeft - element.toolbar_tabs.clientWidth / 2 + current.clientWidth / 2;
        toolbar_indicator.style.width = (current.clientWidth - toolbar_indicator.clientWidth) + "px";
        toolbar_indicator.style.left = (current.offsetLeft - toolbar_indicator.offsetLeft) + "px";
        requestArticles(current.id);
        return;
    }

    let frame = 0;
    let fresh_scroll = element.toolbar_tabs.scrollLeft;
    let fresh_width = toolbar_indicator.clientWidth;
    let fresh_left = toolbar_indicator.offsetLeft;

    const interval = setInterval(function () {
        fresh_scroll += step_scroll;
        fresh_width += step_width;
        fresh_left += step_left;
        element.toolbar_tabs.scrollLeft = fresh_scroll;
        toolbar_indicator.style.width = fresh_width + "px";
        toolbar_indicator.style.left = fresh_left + "px";
        frame++;
        if (frame === 16) clearInterval(interval);
    }, 12);

    requestArticles(current.id);
};

let scroll = 0;

element.content.onscroll = function () {
    element.toolbar.className = (element.content.scrollTop > 56 && element.content.scrollTop > scroll) ? "active" : null;
    scroll = element.content.scrollTop;
};

document.getElementById("toolbar_favorite").onclick = function () {
    const toolbar_message = document.getElementById("toolbar_message");
    const toolbar_message_inner = document.getElementById("toolbar_message_inner");
    toolbar_message_inner.innerHTML = current.innerHTML + " set as default source.";
    toolbar_message.className = "active";
    toolbar_message_inner.style.transition = "transform 320ms";
    toolbar_message_inner.style.transform = "translateY(40px)";

    setTimeout(function () {
        toolbar_message.className = null;
        toolbar_message_inner.style.transform = "translateY(80px)";
    }, 800);

    setTimeout(function () {
        toolbar_message_inner.style.transition = null;
        toolbar_message_inner.style.transform = null;
    }, 1200);

    storage.set("favorite", current.id);
};

document.getElementById("offline_action").onclick = function () {
    current.click();
};

document.getElementById("drawer_us").onclick = function () {
    document.getElementById("drawer_us").className = "active";
    document.getElementById("drawer_gb").className = null;
    document.getElementById("drawer_de").className = null;
    renderSources("us");
    storage.set("country", "us");
};

document.getElementById("drawer_gb").onclick = function () {
    document.getElementById("drawer_us").className = null;
    document.getElementById("drawer_gb").className = "active";
    document.getElementById("drawer_de").className = null;
    renderSources("gb");
    storage.set("country", "gb");
};

document.getElementById("drawer_de").onclick = function () {
    document.getElementById("drawer_us").className = null;
    document.getElementById("drawer_gb").className = null;
    document.getElementById("drawer_de").className = "active";
    renderSources("de");
    storage.set("country", "de");
};

window.matchMedia("(prefers-color-scheme: dark)").onchange = function () {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "#181818" : "#FFFFFF";
    document.querySelector("meta[name=theme-color]").setAttribute("content", theme);
};

const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "#181818" : "#FFFFFF";
document.querySelector("meta[name=theme-color]").setAttribute("content", theme);

if (storage.get("country")) {
    document.getElementById("drawer_" + storage.get("country")).click();
} else {
    document.getElementById("drawer_us").click();
}

(function (i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

ga("create", "UA-93476232-1", "auto");
ga("set", "anonymizeIp", true);
ga("send", "pageview");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/worker.js");
}