(function () {
    'use strict';
    const GUID = "ed942f29-391b-4914-8dc3-ce527fd6d8cc";

    const spinnerUrl = browser.runtime.getURL("css/images/spinner.svg");
    const activeIconUrl = browser.runtime.getURL("css/images/logo.svg");

    const scoreIncreased = "Improving";
    const scoreDecreased = "Getting Worse";

    const noChangeIcon = browser.runtime.getURL("css/images/TrendNoChangeIcon.png");
    const improvingIcon = browser.runtime.getURL("css/images/TrendImprovingIcon.png");
    const decliningIcon = browser.runtime.getURL("css/images/TrendDecliningIcon.png");
    const helpIconUrl = browser.runtime.getURL('css/images/icon-help.svg');
    const shareIconUrl = browser.runtime.getURL('css/images/icon-share.svg');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start()
    }


    function createScoreCicle(score, trend, status, previousScore) {
        let color;
        if (status === 'veryGood') {
            color = '#0d6db6';
        } else if (status === 'good') {
            color = '#71207a';
        } else if (status === 'fair') {
            color = '#af2283';
        } else if (status === 'veryPoor') {
            color = '#d62b80';
        } else if (status === 'exceptional') {
            color = '#00458f';
        }

        Circles.create({
            id: 'mtci-' + GUID,
            value: score,
            maxValue: 850,
            radius: 30,
            text: '<img id="pmti-' + GUID + '" src="' + trend + '" />',
            textClass: 'mtcts-' + GUID,
            width: 8,
            duration: false,
            previousScore: previousScore,
            colors: ['#c4ced1', color]
        });
    }

    function showScoreStatus(score) {
        if (score >= 300 && score < 580) {
            return [`<div id="pmsd-${GUID}" class="gst-veryPoor-${GUID}">Very Poor</div>`, "veryPoor"]
        } else if (score >= 580 && score < 670) {
            return [`<div id="pmsd-${GUID}" class="gst-fair-${GUID}">Fair</div>`, "fair"]
        } else if (score >= 670 && score < 740) {
            return [`<div id="pmsd-${GUID}" class="gst-good-${GUID}">Good</div>`, "good"]
        } else if (score >= 740 && score < 800) {
            return [`<div id="pmsd-${GUID}" class="gst-veryGood-${GUID}">Very Good</div>`, "veryGood"]
        } else if (score >= 800 && score <= 850) {
            return [`<div id="pmsd-${GUID}" class="gst-exceptional-${GUID}">Exceptional</div>`, "exceptional"]
        }
    }

    function start() {
        const body = document.getElementsByTagName("body")[0];
        const elChild = document.createElement('div');
        let analyzeBtn = document.getElementById("tbsend-" + GUID);
        browser.runtime.sendMessage({msg: "getPrivacyScore"});
        elChild.innerHTML = `
  <div class="mtc-${GUID}">
    <div class="mth-${GUID}">
      <img src=${activeIconUrl} />
      <a class="ct-${GUID} pmcl-${GUID}"></a>
    </div>
    <div class="pmse-${GUID}"></div>
    <div id="mtm-${GUID}">
      <div id="pmd-${GUID}" class="mtd-${GUID}"></div>
      <div id="mti-${GUID}">
        <div id="mtci-${GUID}"><img id="tcci-${GUID}" src=${spinnerUrl}/></div>
        <div id="tcs-${GUID}"></div>
        <div id="sbq-${GUID}">
        <div id="help-${GUID}"><a id="help-link-${GUID}" href="https://www.privacymonitor.com/rating/" title="What does this score mean?" target="_blank"><img id="help-img-${GUID}" src="${helpIconUrl}"/></a></div>
        <div id="share-${GUID}"><a id="share-link-${GUID}" target="_blank" title="See this score on the web"><img id="share-img-${GUID}" src="${shareIconUrl}"/></a></div>
        </div>
        </div>
    </div>
  </div>
`;

        elChild.classList.add(GUID);

        body.appendChild(elChild);

        document.getElementById("tcci-" + GUID).src = spinnerUrl;

        const modal = document.getElementsByClassName(GUID)[0];
        const closeBtn = document.getElementsByClassName("ct-" + GUID)[0];
        const domainTXT = document.getElementById("pmd-" + GUID);
        let displayModalTimeout;

        closeBtn.onclick = function () {
            modal.style.display = "none";
            clearTimeout(displayModalTimeout);
        }

        browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            const privacyScoreReq = Number(request.score);
            const previousScoreReq = Number(request.previousScore);
            const domain = request.domain;
            if (request.message === 'NotFound') {
                document.getElementById("mtm-" + GUID).innerHTML =
                    `<div id="srta-${GUID}"><div id="padded-${GUID}">Sorry, we havent reviewed ${domain} yet.<br/><br/>If you would like us to add it to the queue for our legal experts to review, hit the &quot;Request&quot; button now.</div>
        <br/>
		<button id="tbsend-${GUID}">Request</button>
		</div>`
                analyzeBtn = document.getElementById("tbsend-" + GUID);

                analyzeBtn.onclick = function () {
                    browser.runtime.sendMessage({msg: "requestReview"});
                    document.getElementById("mtm-" + GUID).innerHTML = '<div id="padded-' + GUID + '">Your request has been received. Please allow up to 10 business days for this site to be reviewed.</div>';
                }

            }

            if (request.message === 'ActiveTabScore' || request.message === 'HiddenTabScore') {
                let trend;
                domainTXT.innerHTML = window.location.hostname;
                // set share link URL
                const domainLinkElement = document.getElementById('share-link-' + GUID);
                domainLinkElement.href = "https://www.privacymonitor.com/rating/?q=" + request.domain;
                if (request.message === 'ActiveTabScore') {
                    modal.style.display = "block";
                    displayModalTimeout = setTimeout(function () {
                        modal.classList.add("pmh-" + GUID);
                        setTimeout(function () {
                            modal.classList.remove("pmh-" + GUID);
                            modal.style.display = "none";
                        }, 1000);

                    }, 1000 * 8);
                }

                if (privacyScoreReq === previousScoreReq) {
                    let span = showScoreStatus(privacyScoreReq)[0];
                    let status = showScoreStatus(privacyScoreReq)[1];
                    trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-nochange-${GUID}">No change</span></div>`;
                    createScoreCicle(privacyScoreReq, noChangeIcon, status, previousScoreReq);
                } else if (isNaN(previousScoreReq)) {
                    if (previousScore !== null) {
                        if (privacyScoreReq === previousScore) {
                            let span = showScoreStatus(privacyScoreReq)[0];
                            let status = showScoreStatus(privacyScoreReq)[1];
                            trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-nochange-${GUID}">No change</span></div>`;
                            createScoreCicle(privacyScoreReq, noChangeIcon, status, previousScore);
                        } else if (privacyScoreReq > previousScore) {
                            let span = showScoreStatus(privacyScoreReq)[0];
                            let status = showScoreStatus(privacyScoreReq)[1];
                            trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-increased-${GUID}">${scoreIncreased}</span></div>`;
                            createScoreCicle(privacyScoreReq, improvingIcon, status, previousScore);
                        } else if (privacyScoreReq < previousScore) {
                            let span = showScoreStatus(privacyScoreReq)[0];
                            let status = showScoreStatus(privacyScoreReq)[1];
                            trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-decreased-${GUID}">Getting Worse</span></div>`;
                            createScoreCicle(privacyScoreReq, decliningIcon, status, previousScore);
                        }
                    } else {
                        let span = showScoreStatus(privacyScoreReq)[0];
                        let status = showScoreStatus(privacyScoreReq)[1];
                        trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-nochange-${GUID}">No History</span></div>`;
                        createScoreCicle(privacyScoreReq, noChangeIcon, status, false);
                    }
                } else if (previousScoreReq === 0) {
                    let span = showScoreStatus(privacyScoreReq)[0];
                    let status = showScoreStatus(privacyScoreReq)[1];
                    trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-nochange-${GUID}">No History</span></div>`;
                    createScoreCicle(privacyScoreReq, noChangeIcon, status, false);
                } else if (privacyScoreReq > previousScoreReq) {
                    let span = showScoreStatus(privacyScoreReq)[0];
                    let status = showScoreStatus(privacyScoreReq)[1];
                    trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-increased-${GUID}">${scoreIncreased}</span></div>`;
                    createScoreCicle(privacyScoreReq, improvingIcon, status, previousScoreReq);
                } else if (privacyScoreReq < previousScoreReq) {
                    let span = showScoreStatus(privacyScoreReq)[0];
                    let status = showScoreStatus(privacyScoreReq)[1];
                    trend = `${span}<div class="pmt-${GUID}">Trend: <span class="gtt-decreased-${GUID}">${scoreDecreased}</span></div>`;
                    createScoreCicle(privacyScoreReq, decliningIcon, status, previousScoreReq);
                }
                document.getElementById("tcs-" + GUID).innerHTML = `<div>Score: ${privacyScoreReq}</div>${trend}`;
            }
            if (request.message === "ClickedOnIcon") {
                modal.style.display = "block";
            }
        });
    }
}());
