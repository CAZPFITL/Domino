import Tools from "./../helpers/Tools.js";

export default class Gui {
    constructor(app, callback = (fn) => fn()) {
        this.app = app;
        this.get = Gui;
        this.ctx = Gui.createCanvas('gameCanvas');
        this.app.factory.addGameEntity(this);
        callback(() => {
            this.app.log.registerEvent(
                `New Gui Created`,
                `\x1b[32;1m| \x1b[0mNew \x1b[32;1mApp Gui\x1b[0m Created`
            );
        });
    }

    static viewportCoords = ({x, y}, viewport) => ({
        x: x / viewport.scale.x + viewport.left,
        y: y / viewport.scale.y + viewport.top
    })

    static clickCoords = (e, viewport) => ({
        x: e.clientX / viewport.scale.x + viewport.left,
        y: e.clientY / viewport.scale.y + viewport.top
    })

    static isPointInsidePolygon = (point, polygon) => {
        let isInside = false;
        let i = 0;
        let j = polygon.length - 1;

        for (; i < polygon.length; j = i++) {
            const x = {
                dividend: (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y),
                divisor: (polygon[j].y - polygon[i].y)
            }
            const condition1 = (polygon[i].y > point.y) !== (polygon[j].y > point.y);
            const condition2 = (point.x < x.dividend / x.divisor + polygon[i].x);

            if (condition1 && condition2) {
                isInside = !isInside;
            }
        }
        return isInside;
    }

    static createCanvas(id) {
        const canvas = document.getElementById(id);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return canvas.getContext('2d');
    }

    static isClicked(entity, click, callback) {
        if (!entity) return;
        const {x, y, width, height} = entity;
        if (click.x > x && click.x < x + width && click.y > y && click.y < y + height) {
            callback();
        }
    }

    static isHover(entity, click) {
        if (!entity) return;
        const {x, y, width, height} = entity;
        return (
            click.x > x &&
            click.x < x + width &&
            click.y > y &&
            click.y < y + height
        );
    }

    static checkHoverCollection({collection, event, viewport, isHover, isOut, caller}) {
        for (const key in collection) {
            if (collection[key]?.position === 'viewport' &&
                Gui.isHover(collection[key], Gui.viewportCoords(event, viewport))) {
                isHover(key);
            } else if (collection[key]?.position === 'controls' &&
                Gui.isHover(collection[key], {x: event.clientX, y: event.clientY})) {
                isHover(key);
            } else {
                if (caller === key) {
                    isOut(key);
                }
            }
        }
    }

    static entityAt(click, collection) {
        if (!collection) return;
        for (let i = 0; i < collection.length; i++) {
            const entity = collection[i];

            if (entity.vertices instanceof Array) {
                const polysIntersect = Gui.isPointInsidePolygon(click, entity.vertices);
                if (polysIntersect)
                    return entity;
            }
        }
    }

    static drawPolygon(ctx, entity, type = 'fill') {
        if (entity.vertices.length < 1) return;

        ctx.beginPath();
        ctx.moveTo(entity.vertices[0].x, entity.vertices[0].y);

        for (let i = 1; i < entity.vertices.length; i++) {
            ctx.lineTo(entity.vertices[i].x, entity.vertices[i].y);
        }

        ctx.lineTo(entity.vertices[0].x, entity.vertices[0].y);

        ctx.fillStyle = entity.color ?? '#000';
        ctx[type]();
    }

    static drawImage(ctx, entity, width, height) {
        ctx.save();
        ctx.translate(entity.body.position.x, entity.body.position.y);
        ctx.rotate(-entity.body.angle);

        ctx.drawImage(
            entity.img,
            width * entity.frameCounter,
            0,
            width,
            height,
            -entity.size.width / 2,
            -entity.size.height / 2,
            entity.size.width,
            entity.size.height,
        );

        ctx.restore();
    }

    static button({
                      ctx,
                      x,
                      y,
                      width,
                      height,
                      font,
                      text,
                      bg = '#ffffff',
                      color = '#000',
                      stroke = '#000',
                      center = true,
                      widthStroke = 1
                  }) {
        this.square({ctx, x, y, width, height, color: bg, stroke, widthStroke});
        this.text({ctx, font, color, text, x, y, width, height, center});
    }

    static square({ctx, x, y, width, height, color = '#FFF', stroke = false, widthStroke = 1}) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        if (stroke) {
            const cache = ctx.lineWidth;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = widthStroke;
            ctx.stroke();
            ctx.lineWidth = cache;
        }
    }

    static text({ctx, font, color, text, x, y, width, height, center = false}) {
        ctx.font = font;
        ctx.fillStyle = color;
        const xText = x + width / 2 - ctx.measureText(text).width / 2;
        const yText = y + height / 2 + 5;
        ctx.fillText(text, center ? xText : x, center ? yText : y);
        return ctx.measureText(text).width;
    }

    static line({ctx, x1, y1, x2, y2, color = '#000'}) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    /**
     * PLANCKJS HELPERS
     */
    static drawPlPolygon(ctx, entity, ui, color="#c700ff") {
        ctx.save();
        let points = entity.vertices;

        if (!points || !points.length) {
            return;
        }
        ctx.translate(entity.position.c.x, -entity.position.c.y)
        ctx.rotate(-entity.position.a)

        ctx.beginPath();
        ctx.moveTo(points[0].x, -points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, -points[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}