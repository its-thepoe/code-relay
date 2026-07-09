import test from "node:test";
import assert from "node:assert/strict";
import { extractFramerNodeStyles } from "../../../apps/plugin/src/framer-style-extraction.js";
test("extractFramerNodeStyles turns Framer stack traits into flex css", () => {
    const styles = extractFramerNodeStyles({
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "space-between",
        stackAlignment: "center",
        stackWrapEnabled: true,
        gap: 24,
        padding: 32,
        backgroundColor: "#101828",
        borderRadius: 20,
    });
    assert.equal(styles.display, "flex");
    assert.equal(styles.flexDirection, "row");
    assert.equal(styles.justifyContent, "space-between");
    assert.equal(styles.alignItems, "center");
    assert.equal(styles.flexWrap, "wrap");
    assert.equal(styles.gap, "24px");
    assert.equal(styles.padding, "32px");
    assert.equal(styles.backgroundColor, "#101828");
    assert.equal(styles.borderRadius, "20px");
});
test("extractFramerNodeStyles turns Framer grid traits into grid css", () => {
    const styles = extractFramerNodeStyles({
        layout: "grid",
        gridColumnCount: 3,
        gridColumnWidthType: "minmax",
        gridColumnMinWidth: 180,
        gridRowCount: 2,
        gridRowHeightType: "fixed",
        gridRowHeight: 120,
        gridAlignment: "center",
    });
    assert.equal(styles.display, "grid");
    assert.equal(styles.gridTemplateColumns, "repeat(3, minmax(180px, 1fr))");
    assert.equal(styles.gridTemplateRows, "repeat(2, 120px)");
    assert.equal(styles.placeItems, "center");
});
test("extractFramerNodeStyles preserves background assets, overflow, aspect ratio, and rotation", () => {
    const styles = extractFramerNodeStyles({
        backgroundImage: {
            url: "https://example.com/hero.png",
            size: "cover",
            position: "center center",
            repeat: false,
        },
        backgroundGradient: {
            cssText: "linear-gradient(180deg, #000000 0%, #111111 100%)",
        },
        overflow: {
            value: "hidden",
            x: "hidden",
            y: "visible",
        },
        aspectRatio: { width: 16, height: 9 },
        rotation: 12,
        zIndex: 8,
    });
    assert.equal(styles.backgroundImage, 'url("https://example.com/hero.png")');
    assert.equal(styles.background, "linear-gradient(180deg, #000000 0%, #111111 100%)");
    assert.equal(styles.backgroundSize, "cover");
    assert.equal(styles.backgroundPosition, "center center");
    assert.equal(styles.backgroundRepeat, "no-repeat");
    assert.equal(styles.overflow, "hidden");
    assert.equal(styles.overflowX, "hidden");
    assert.equal(styles.overflowY, "visible");
    assert.equal(styles.aspectRatio, "16 / 9");
    assert.equal(styles.transform, "rotate(12deg)");
    assert.equal(styles.zIndex, "8");
});
test("extractFramerNodeStyles turns Framer grid item traits into placement css", () => {
    const styles = extractFramerNodeStyles({
        gridItemFillCellWidth: true,
        gridItemFillCellHeight: true,
        gridItemHorizontalAlignment: "center",
        gridItemVerticalAlignment: "end",
        gridItemColumnSpan: "all",
        gridItemRowSpan: 2,
    });
    assert.equal(styles.justifySelf, "center");
    assert.equal(styles.alignSelf, "end");
    assert.equal(styles.gridColumn, "1 / -1");
    assert.equal(styles.gridRow, "span 2 / span 2");
    assert.equal(styles.placeSelf, "end center");
});
