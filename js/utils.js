const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const clampValueToRange = (value, range, callback) => {
  const clampedValue = Math.min(Math.max(value, range[0]), range[range.length - 1]);
  if (clampedValue !== value) callback(clampedValue);
  return clampedValue
}

const calcActualVh = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

calcActualVh();
window.addEventListener('resize', throttle(calcActualVh, 200));

const downloadSVG = () => {
  const svgString = document.getElementById("SVG-renderer").innerHTML;
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ruler.svg";
  link.click();
  URL.revokeObjectURL(url);
}
