namespace jy {
    /**
     * 常用的颜色常量
     * 
     * @export
     * @enum {number}
     */
    export const enum Color {
        Red = 0xff0000,
        Green = 0xff00,
        Yellow = 0xffff00,
        White = 0xffffff,

        Gray = 0xcccccc,
    }
    /**
     * 常用的颜色字符串常量
     * 
     * @export
     * @enum {string}
     */
    export const enum ColorString {
        Red = "#ff0000",
        Green = "#00ff00",

        Yellow = "#ffff00",
        White = "#ffffff",

        Gray = "#cccccc",
    }

    function getColorString(c: number) {
        return "#" + c.toString(16).zeroize(6);
    }

    let idx = 0;
    let increaseCount = 5;
    let size = Math.pow(2, increaseCount);

    let sheet = getTextureSheet(size << 2);

    function checkCanvas() {
        if (idx >= size * size) {
            size <<= 1;
            sheet.extSize(size << 2);
            increaseCount++;
        }
    }

    /**
     * ```
     * ┌─┬─┐
     * │0│1│
     * ├─┼─┤
     * │2│3│
     * └─┴─┘
     * ```
     */
    const poses = [
        /**0 */[0, 0],
        /**1 */[1, 0],
        /**2 */[0, 1],
        /**3 */[1, 1]
    ]


	/**
	 * 颜色工具
	 * @author 3tion
	 *
	 */
    export const ColorUtil = {
        /**
         * 获取颜色字符串 #a1b2c3
         * @param c
         * @return 获取颜色字符串 #a1b2c3
         *
         */
        getColorString,

        /**
         * 将#a1b2c3这样#开头的颜色字符串，转换成颜色数值
         */
        getColorValue(c: string) {
            if (/#[0-9a-f]{6}/i.test(c)) {
                return +("0x" + c.substring(1));
            } else {
                if (DEBUG) {
                    ThrowError(`使用的颜色${c}有误`);
                }
                return 0;
            }
        },
        /**
         * 获取一个纯色的纹理
         */
        getTexture(color = 0, alpha = 0.8) {
            let key = color + "_" + alpha;
            let tex = sheet.get(key);
            if (!tex) {
                checkCanvas();
                let count = increaseCount;
                let x = 0, y = 0;
                let cidx = idx;
                do {
                    let shift = 2 * count;
                    let area = cidx >> shift;
                    cidx = cidx - (area << shift);
                    let pos = poses[area];
                    let pp = 2 << (shift / 2 - 1);
                    x += pos[0] * pp;
                    y += pos[1] * pp;
                    if (!--count) {
                        let pos = poses[cidx];
                        x += pos[0];
                        y += pos[1];
                        break
                    }
                } while (true)
                let ctx = sheet.ctx;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = getColorString(color);
                x <<= 2;
                y <<= 2;
                ctx.fillRect(x, y, 4, 4);
                const ww = 2;
                tex = sheet.reg(key, { x: x + 1, y: y + 1, width: ww, height: ww });
                if (tex) {
                    idx++;
                }
            }
            return tex;
        }
    }
}
