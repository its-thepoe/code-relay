export function extractFramerNodeStyles(raw) {
    const font = raw.font;
    const styles = {};
    addStyle(styles, "color", cssColor(raw.color));
    addStyle(styles, "backgroundColor", cssColor(raw.backgroundColor));
    addStyle(styles, "backgroundImage", cssBackgroundImage(raw.backgroundImage));
    addStyle(styles, "background", cssGradient(raw.backgroundGradient));
    addStyle(styles, "backgroundPosition", cssBackgroundPosition(raw.backgroundImage));
    addStyle(styles, "backgroundSize", cssBackgroundSize(raw.backgroundImage));
    addStyle(styles, "backgroundRepeat", cssBackgroundRepeat(raw.backgroundImage));
    addStyle(styles, "fontFamily", cssFontFamily(font));
    addStyle(styles, "fontWeight", cssNumber(raw.fontWeight ?? font?.weight));
    addStyle(styles, "fontStyle", cssString(raw.fontStyle ?? font?.style));
    addStyle(styles, "fontSize", cssDimension(raw.fontSize));
    addStyle(styles, "lineHeight", cssDimension(raw.lineHeight));
    addStyle(styles, "letterSpacing", cssDimension(raw.letterSpacing));
    addStyle(styles, "textAlign", cssString(raw.textAlign));
    addStyle(styles, "textTransform", cssString(raw.textTransform));
    addStyle(styles, "textDecoration", cssString(raw.textDecoration));
    addStyle(styles, "opacity", cssNumber(raw.opacity));
    addStyle(styles, "borderRadius", cssBorderRadius(raw.borderRadius));
    addStyle(styles, "border", cssBorder(raw.border));
    addStyle(styles, "boxShadow", cssShadow(raw.boxShadow ?? raw.shadow));
    addStyle(styles, "width", cssDimension(raw.width));
    addStyle(styles, "height", cssDimension(raw.height));
    addStyle(styles, "minWidth", cssDimension(raw.minWidth));
    addStyle(styles, "minHeight", cssDimension(raw.minHeight));
    addStyle(styles, "maxWidth", cssDimension(raw.maxWidth));
    addStyle(styles, "maxHeight", cssDimension(raw.maxHeight));
    addStyle(styles, "padding", cssDimension(raw.padding));
    addStyle(styles, "paddingTop", cssDimension(raw.paddingTop));
    addStyle(styles, "paddingRight", cssDimension(raw.paddingRight));
    addStyle(styles, "paddingBottom", cssDimension(raw.paddingBottom));
    addStyle(styles, "paddingLeft", cssDimension(raw.paddingLeft));
    addStyle(styles, "gap", cssDimension(raw.gap));
    addStyle(styles, "rowGap", cssDimension(raw.rowGap));
    addStyle(styles, "columnGap", cssDimension(raw.columnGap));
    addStyle(styles, "overflow", cssOverflow(raw.overflow));
    addStyle(styles, "overflowX", cssOverflowAxis(raw.overflow, "x"));
    addStyle(styles, "overflowY", cssOverflowAxis(raw.overflow, "y"));
    addStyle(styles, "position", cssString(raw.position));
    addStyle(styles, "top", cssDimension(raw.top));
    addStyle(styles, "right", cssDimension(raw.right));
    addStyle(styles, "bottom", cssDimension(raw.bottom));
    addStyle(styles, "left", cssDimension(raw.left));
    addStyle(styles, "aspectRatio", cssAspectRatio(raw.aspectRatio));
    addStyle(styles, "zIndex", cssNumber(raw.zIndex));
    addStyle(styles, "transform", cssRotation(raw.rotation));
    const layoutStyles = extractLayoutStyles(raw);
    for (const [key, value] of Object.entries(layoutStyles)) {
        addStyle(styles, key, value);
    }
    return styles;
}
function extractLayoutStyles(raw) {
    const styles = {};
    const layout = cssString(raw.layout);
    const stackDirection = cssString(raw.stackDirection);
    const stackDistribution = cssString(raw.stackDistribution);
    const stackAlignment = cssString(raw.stackAlignment);
    const stackWrapEnabled = raw.stackWrapEnabled;
    if (layout === "stack" || stackDirection || stackDistribution || stackAlignment) {
        styles.display = "flex";
        const direction = mapStackDirection(stackDirection);
        if (direction)
            styles.flexDirection = direction;
        const justifyContent = mapStackDistribution(stackDistribution);
        if (justifyContent)
            styles.justifyContent = justifyContent;
        const alignItems = mapAlignment(stackAlignment);
        if (alignItems)
            styles.alignItems = alignItems;
        if (typeof stackWrapEnabled === "boolean") {
            styles.flexWrap = stackWrapEnabled ? "wrap" : "nowrap";
        }
    }
    const gridColumnCount = raw.gridColumnCount;
    const gridRowCount = raw.gridRowCount;
    const gridAlignment = cssString(raw.gridAlignment);
    if (layout === "grid" || gridColumnCount != null || gridRowCount != null) {
        styles.display = "grid";
        const columns = cssGridTemplateColumns({
            count: gridColumnCount,
            widthType: raw.gridColumnWidthType,
            width: raw.gridColumnWidth,
            minWidth: raw.gridColumnMinWidth,
        });
        if (columns)
            styles.gridTemplateColumns = columns;
        const rows = cssGridTemplateRows({
            count: gridRowCount,
            heightType: raw.gridRowHeightType,
            height: raw.gridRowHeight,
        });
        if (rows)
            styles.gridTemplateRows = rows;
        const placeItems = mapAlignment(gridAlignment);
        if (placeItems)
            styles.placeItems = placeItems;
    }
    const gridItemStyles = extractGridItemStyles(raw);
    for (const [key, value] of Object.entries(gridItemStyles)) {
        styles[key] = value;
    }
    return styles;
}
function extractGridItemStyles(raw) {
    const styles = {};
    if (raw.gridItemFillCellWidth === true) {
        styles.justifySelf = "stretch";
        styles.width = styles.width ?? "100%";
    }
    if (raw.gridItemFillCellHeight === true) {
        styles.alignSelf = "stretch";
        styles.height = styles.height ?? "100%";
    }
    const horizontal = mapGridItemAlignment(cssString(raw.gridItemHorizontalAlignment));
    if (horizontal)
        styles.justifySelf = horizontal;
    const vertical = mapGridItemAlignment(cssString(raw.gridItemVerticalAlignment));
    if (vertical)
        styles.alignSelf = vertical;
    const columnSpan = cssGridSpan(raw.gridItemColumnSpan);
    if (columnSpan)
        styles.gridColumn = columnSpan;
    const rowSpan = cssGridSpan(raw.gridItemRowSpan);
    if (rowSpan)
        styles.gridRow = rowSpan;
    if (styles.alignSelf && styles.justifySelf) {
        styles.placeSelf = `${styles.alignSelf} ${styles.justifySelf}`;
    }
    return styles;
}
function addStyle(styles, key, value) {
    if (!value)
        return;
    if (value === "transparent" || value === "rgba(0, 0, 0, 0)")
        return;
    styles[key] = value;
}
function cssString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function cssNumber(value) {
    return typeof value === "number" && Number.isFinite(value)
        ? String(value)
        : cssString(value);
}
function cssFontFamily(font) {
    const family = cssString(font?.family ?? font?.name);
    return family ? family.replaceAll('"', "") : undefined;
}
function cssColor(value) {
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(raw.color ?? raw.value);
}
function cssDimension(value) {
    if (typeof value === "number" && Number.isFinite(value))
        return `${value}px`;
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    const cssText = cssString(raw.cssText ?? raw.value);
    if (cssText)
        return cssText;
    const numeric = typeof raw.number === "number"
        ? raw.number
        : typeof raw.value === "number"
            ? raw.value
            : undefined;
    if (numeric === undefined)
        return undefined;
    const unit = cssString(raw.unit) ?? "px";
    return `${numeric}${unit}`;
}
function cssBorderRadius(value) {
    const direct = cssDimension(value);
    if (direct)
        return direct;
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    const corners = [
        cssDimension(raw.topLeft ?? raw.topLeftRadius),
        cssDimension(raw.topRight ?? raw.topRightRadius),
        cssDimension(raw.bottomRight ?? raw.bottomRightRadius),
        cssDimension(raw.bottomLeft ?? raw.bottomLeftRadius),
    ];
    return corners.every(Boolean) ? corners.join(" ") : undefined;
}
function cssBorder(value) {
    if (!value || typeof value !== "object")
        return cssString(value);
    const raw = value;
    const width = cssDimension(raw.width) ?? "1px";
    const style = cssString(raw.style) ?? "solid";
    const color = cssColor(raw.color) ?? "currentColor";
    return `${width} ${style} ${color}`;
}
function cssShadow(value) {
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    const x = cssDimension(raw.x) ?? "0px";
    const y = cssDimension(raw.y) ?? "0px";
    const blur = cssDimension(raw.blur) ?? "0px";
    const spread = cssDimension(raw.spread) ?? "0px";
    const color = cssColor(raw.color) ?? "rgba(0, 0, 0, 0.15)";
    const inset = raw.inset ? " inset" : "";
    return `${x} ${y} ${blur} ${spread} ${color}${inset}`;
}
function cssOverflow(value) {
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(raw.value ?? raw.all);
}
function cssOverflowAxis(value, axis) {
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(axis === "x" ? raw.x : raw.y);
}
function cssAspectRatio(value) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return String(value);
    }
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    const width = typeof raw.width === "number"
        ? raw.width
        : typeof raw.x === "number"
            ? raw.x
            : undefined;
    const height = typeof raw.height === "number"
        ? raw.height
        : typeof raw.y === "number"
            ? raw.y
            : undefined;
    if (typeof width === "number" &&
        Number.isFinite(width) &&
        typeof height === "number" &&
        Number.isFinite(height) &&
        height !== 0) {
        return `${width} / ${height}`;
    }
    return cssString(raw.value ?? raw.cssText);
}
function cssRotation(value) {
    if (typeof value === "number" && Number.isFinite(value) && value !== 0) {
        return `rotate(${value}deg)`;
    }
    if (typeof value === "string" && value.trim() && value !== "0") {
        return value.includes("rotate(") ? value.trim() : `rotate(${value.trim()}deg)`;
    }
    return undefined;
}
function cssBackgroundImage(value) {
    if (typeof value === "string" && value.trim()) {
        return value.includes("url(") ? value.trim() : `url("${value.trim()}")`;
    }
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    const url = cssString(raw.url) ??
        cssString(raw.src) ??
        cssString(raw.thumbnailUrl) ??
        cssString(raw.value);
    if (!url)
        return undefined;
    return url.includes("url(") ? url : `url("${url}")`;
}
function cssBackgroundPosition(value) {
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(raw.position ?? raw.backgroundPosition);
}
function cssBackgroundSize(value) {
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(raw.size ?? raw.backgroundSize);
}
function cssBackgroundRepeat(value) {
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    if (typeof raw.repeat === "boolean")
        return raw.repeat ? "repeat" : "no-repeat";
    return cssString(raw.repeat);
}
function cssGradient(value) {
    if (typeof value === "string" && value.trim())
        return value.trim();
    if (!value || typeof value !== "object")
        return undefined;
    const raw = value;
    return cssString(raw.cssText ?? raw.value ?? raw.background);
}
function mapStackDirection(value) {
    if (value === "horizontal")
        return "row";
    if (value === "vertical")
        return "column";
    return cssString(value);
}
function mapStackDistribution(value) {
    if (!value)
        return undefined;
    switch (value) {
        case "start":
            return "flex-start";
        case "end":
            return "flex-end";
        default:
            return value;
    }
}
function mapAlignment(value) {
    if (!value)
        return undefined;
    switch (value) {
        case "start":
            return "flex-start";
        case "end":
            return "flex-end";
        default:
            return value;
    }
}
function mapGridItemAlignment(value) {
    if (!value)
        return undefined;
    switch (value) {
        case "start":
            return "start";
        case "end":
            return "end";
        default:
            return value;
    }
}
function cssGridSpan(value) {
    if (value === "all")
        return "1 / -1";
    if (typeof value === "number" && Number.isFinite(value) && value > 1) {
        return `span ${value} / span ${value}`;
    }
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }
    return undefined;
}
function cssGridTemplateColumns(input) {
    const count = input.count;
    const widthType = cssString(input.widthType);
    const width = cssDimension(input.width);
    const minWidth = cssDimension(input.minWidth);
    if (count === "auto-fill") {
        return `repeat(auto-fill, minmax(${minWidth ?? width ?? "0px"}, 1fr))`;
    }
    if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) {
        return undefined;
    }
    if (widthType === "fixed" && width) {
        return `repeat(${count}, ${width})`;
    }
    if (widthType === "minmax" && (minWidth || width)) {
        return `repeat(${count}, minmax(${minWidth ?? width ?? "0px"}, 1fr))`;
    }
    return `repeat(${count}, minmax(0, 1fr))`;
}
function cssGridTemplateRows(input) {
    const count = input.count;
    const heightType = cssString(input.heightType);
    const height = cssDimension(input.height);
    if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) {
        return undefined;
    }
    if (heightType === "fixed" && height) {
        return `repeat(${count}, ${height})`;
    }
    if (heightType === "fit") {
        return `repeat(${count}, fit-content(${height ?? "100%"}))`;
    }
    return `repeat(${count}, ${height ?? "auto"})`;
}
