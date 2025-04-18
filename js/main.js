const width = document.getElementById("width");
const length = document.getElementById("length");

const mmTickLength = document.getElementById("mmTickLength");
const mmTickColor = document.getElementById("mmTickColor");

const cmTickLength = document.getElementById("cmTickLength");
const cmTickColor = document.getElementById("cmTickColor");

const cmLabelOffset = document.getElementById("cmLabelOffset");

const fontSize = document.getElementById("fontSize");
const fontColor = document.getElementById("fontColor");

const startMargin = document.getElementById("startMargin");
const endMargin = document.getElementById("endMargin");

const startText = document.getElementById("startText");
const endText = document.getElementById("endText");

const cmLabelOffsetNow = document.getElementById("cmLabelOffsetNow");
const cmLabelOffsetMin = document.getElementById("cmLabelOffsetMin");
const cmLabelOffsetMax = document.getElementById("cmLabelOffsetMax");

const mmTickLengthNow = document.getElementById("mmTickLengthNow");
const mmTickLengthMin = document.getElementById("mmTickLengthMin");
const mmTickLengthMax = document.getElementById("mmTickLengthMax");

const cmTickLengthNow = document.getElementById("cmTickLengthNow");
const cmTickLengthMin = document.getElementById("cmTickLengthMin");
const cmTickLengthMax = document.getElementById("cmTickLengthMax");

const fontSizeNow = document.getElementById("fontSizeNow");
const fontSizeMin = document.getElementById("fontSizeMin");
const fontSizeMax = document.getElementById("fontSizeMax");

const formContainer = document.getElementById("form-container");
const form = document.getElementById("ruler-form");
const title = document.getElementById("title");

const renderer = document.getElementById("SVG-renderer");

const resetSVG = document.getElementById("reset-SVG")
const startSVG = document.getElementById("start-SVG")
const exportSVG = document.getElementById("export-SVG")

const listener = (fS, fSn, fSm, cLO, cLORn, cLORm, mTL, mTLRn, mTLRm, cTL, cTLRn, cTLRm) => {
    fontSizeNow.innerText = fontSize.value = fS;
    fontSizeMin.innerHTML = fSn;
    fontSize.setAttribute("min", fSn)
    fontSizeMax.innerHTML = fSm;
    fontSize.setAttribute("max", fSm)

    cmLabelOffsetNow.innerText = cmLabelOffset.value = cLO;
    cmLabelOffsetMin.innerHTML = cLORn;
    cmLabelOffset.setAttribute("min", cLORn)
    cmLabelOffsetMax.innerHTML = cLORm;
    cmLabelOffset.setAttribute("max", cLORm)

    mmTickLengthNow.innerText = mmTickLength.value = mTL;
    mmTickLengthMin.innerHTML = mTLRn;
    mmTickLength.setAttribute("min", mTLRn)
    mmTickLengthMax.innerHTML = mTLRm;
    mmTickLength.setAttribute("max", mTLRm)

    cmTickLengthNow.innerText = cmTickLength.value = cTL;
    cmTickLengthMin.innerHTML = cTLRn;
    cmTickLength.setAttribute("min", cTLRn)
    cmTickLengthMax.innerHTML = cTLRm;
    cmTickLength.setAttribute("max", cTLRm)
};

const initRuler = (savedRulerData) => {
    form.reset();

    const _ruler = new Ruler(renderer, listener, savedRulerData);

    _ruler.render();

    window.ruler = _ruler;
}

window.addEventListener('load', () => {
    startSVG.style.bottom = "0"
});


const updateRuler = throttle(({ target: { name: key, value } }) => {
    window.ruler.updateProperty(key, value)
}, 200)

fontSize.addEventListener("change", updateRuler)
fontSize.addEventListener("input", (event) => {
    navigator.vibrate(200)
})
fontColor.addEventListener("blur", updateRuler)

mmTickLength.addEventListener("change", updateRuler)
mmTickLength.addEventListener("input", (event) => {
    navigator.vibrate(200)
})
mmTickColor.addEventListener("change", updateRuler)

cmTickLength.addEventListener("change", updateRuler)
cmTickLength.addEventListener("input", (event) => {
    navigator.vibrate(200)
})
cmTickColor.addEventListener("change", updateRuler)

cmLabelOffset.addEventListener("change", updateRuler)
cmLabelOffset.addEventListener("input", (event) => {
    navigator.vibrate(200)
})

startMargin.addEventListener("blur", updateRuler)
startMargin.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

endMargin.addEventListener("blur", updateRuler)
endMargin.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

startText.addEventListener("blur", updateRuler)
startText.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

endText.addEventListener("blur", updateRuler)
endText.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

length.addEventListener("blur", updateRuler)
length.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

width.addEventListener("blur", updateRuler)
width.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        updateRuler(event)
    }
})

resetSVG.addEventListener("click", function () {
    localStorage.removeItem("rulerData");
    initRuler();
})

exportSVG.addEventListener("click", downloadSVG)

startSVG.addEventListener("click", () => {
    startSVG.style.bottom = "-100%";
    resetSVG.style.bottom = "0";
    resetSVG.style.width = "50vw";
    exportSVG.style.bottom = "0";
    exportSVG.style.width = "50vw";
    exportSVG.style.left = "50vw";

    title.style.opacity = "0";
    title.style.left = "-50vw";

    formContainer.style.right = "0";
    formContainer.style.opacity = "1";

    const savedRulerData = localStorage.getItem('rulerData');
    initRuler(savedRulerData || {});
})

