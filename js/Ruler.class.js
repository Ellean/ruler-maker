class Ruler {
  _renderer = null;

  width = 20;
  length = 100;
  mmTickLength = 10;
  cmTickLength = 20;
  cmLabelOffset = 15;
  startMargin = 10;
  endMargin = 10;
  startText = "Start";
  endText = "End";
  fontSize = 5;
  fontColor = "#000";
  mmTickColor = "#000";
  cmTickColor = "#000";

  rangeUpdateListener = () => { }

  #numberKeys = [
    "width",
    "length",
    "mmTickLength",
    "cmTickLength",
    "cmNumberLabelOffset",
    "startMargin",
    "endMargin",
    "fontSize",
  ]

  constructor(renderer, listener, params = {}) {
    this._renderer = renderer;
    this.rangeUpdateListener = listener;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== "") {
        if (this.#numberKeys.includes(key)) {
          this[key] = parseFloat(value);
        } else {
          this[key] = value;
        }
      }
    });
  }

  getSvgString() {
    const { width,
      length,
      mmTickLength,
      cmTickLength,
      cmLabelOffset,
      startMargin,
      startText,
      endText,
      fontSize,
      fontColor,
      mmTickColor,
      cmTickColor,
      mmToPx,
    }
      = this;

    const svgLength = this.length + this.startMargin + this.endMargin + this.fontSize;
    const svgWidth = this.width + 20;

    // SVG header
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${mmToPx(svgWidth)}" height="${mmToPx(svgLength)}" viewBox="0 0 ${svgWidth} ${svgLength}">\n`;

    // Add start and end text labels
    svg += `  <text x="${width / 2}" y="${fontSize}" font-size="${fontSize}" fill="${fontColor}" text-anchor="middle">${startText}</text>\n`;
    svg += `  <text x="${width / 2}" y="${svgLength}" font-size="${fontSize}" fill="${fontColor}" text-anchor="middle">${endText}</text>\n`;

    // Draw ticks and labels
    for (let i = 0; i <= length; i++) {
      const y = startMargin + i;
      let tickLength = mmTickLength;
      let tickColor = mmTickColor;

      // Longer tick and label for every 10mm (1cm)
      if (i % 10 === 0) {
        tickLength = cmTickLength;
        tickColor = cmTickColor;

        // Add cm number labels
        const cmNumber = i / 10;
        svg += `  <text x="${cmLabelOffset}" y="${y + fontSize / 2 + 2}" font-size="${fontSize}" fill="${fontColor}" text-anchor="start">${cmNumber}</text>\n`;
      }

      // Draw tick line
      svg += `  <line x1="0" y1="${y}" x2="${tickLength}" y2="${y}" stroke="${tickColor}" stroke-width="0.2"/>\n`;
    }

    // SVG footer
    svg += `</svg>\n`;

    return svg;
  }

  fontSizeRange = () => {
    return [4, 10]
  }

  cmLabelOffsetRange = () => {
    const { mmTickLength, cmTickLength } = this;
    return [mmTickLength, cmTickLength];
  }

  mmTickLengthRange = () => {
    return [1, this.cmTickLength - 1];
  }

  cmTickLengthRange = () => {
    const { width, mmTickLength } = this;
    return [mmTickLength + 1, width];
  }

  render = () => {
    this._renderer.innerHTML = this.getSvgString();
    this.emitData();
  }

  mmToPx(mm) {
    return mm * document.getElementById("mm").getBoundingClientRect().width;
  }

  updateProperty = (key, value) => {
    const {
      updateRanges: uRs,
      emitData: eD,
      render,
      getNumberKeys: gNKs,
      setValueOfKey: sVoK,
    } = this;

    sVoK(key, value !== "" ? value : this[key])

    if (gNKs().includes(key) && value !== "") {
      sVoK(key, parseFloat(value));
      uRs();
    }
    eD();

    render("SVG-renderer");
  }

  cmTickLengthUpdate = (value) => {
    this.cmTickLength = value;
  }

  getNumberKeys = () => {
    return this.#numberKeys;
  }

  setValueOfKey = (key, value) => {
    this[key] = value;
  }

  /**
   * 更新范围值
   * 
   * 此函数负责调用范围更新监听器，并使用解构赋值从类的属性中提取所需的参数
   * 它还调用了一个方法来将值限制在指定的范围内
   */
  updateRanges = () => {
    // 从类的属性中解构赋值，以获取所需的参数
    const {
      fontSize: fS,
      fontSizeRange: fSR,
      cmTickLength: cTL,
      cmTickLengthRange: cTLR,
      mmTickLength: mTL,
      mmTickLengthRange: mTLR,
      cmLabelOffset: cLO,
      cmLabelOffsetRange: cLOR,
      clampValuesToRanges: cVsTRs,
      rangeUpdateListener: rUL,
      emitData: eD,
    } = this;

    // 调用方法将值限制在指定的范围内
    cVsTRs();
    eD()
  }

  emitData = () => {
    const {
      fontSize: fS,
      fontSizeRange: fSR,
      cmLabelOffset: cLO,
      cmLabelOffsetRange: cLOR,
      mmTickLength: mTL,
      mmTickLengthRange: mTLR,
      cmTickLength: cTL,
      cmTickLengthRange: cTLR,
      rangeUpdateListener: rUL,
    } = this;
    const data = [fS, fSR()[0], fSR()[1], cLO, cLOR()[0], cLOR()[1], mTL, mTLR()[0], mTLR()[1], cTL, cTLR()[0], cTLR()[1]]

    rUL(...data)
  }

  /**
   * 将各个尺寸值限制在各自的范围内
   * 
   * 此函数旨在确保尺子的各项尺寸（如标签偏移、刻度长度等）都在预定的范围内
   * 它通过调用 clampValueToRange 函数，将每个尺寸值与其对应的范围进行比较和限制
   */
  clampValuesToRanges = () => {
    // 解构获取各项尺寸的范围及更新范围的方法
    const {
      cmLabelOffsetRange: cLOR,
      mmTickLengthRange: mTLR,
      cmTickLengthRange: cTLR,
      updateProperty: uP,
    } = this;

    // 解构获取当前的各项尺寸值
    let {
      cmLabelOffset: cLO,
      mmTickLength: mTL,
      cmTickLength: cTL,
    } = this;

    // 创建一个通用的更新函数生成器
    const cUP = () => () => uP;

    // 将厘米刻度长度限制在范围内
    cTL = clampValueToRange(cTL, cTLR(), cUP("cmTickLength"));

    // 将毫米刻度长度限制在范围内
    mTL = clampValueToRange(mTL, mTLR(), cUP("mmTickLength"));

    // 将厘米标签偏移量限制在范围内
    cLO = clampValueToRange(cLO, cLOR(), cUP("cmLabelOffset"));
  }
}