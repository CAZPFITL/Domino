import {GAME_OVER, PLAY} from "../../env.js";

export default class Domino {
    constructor({app, size, coords, angle, rotationSpeed, value}) {
        this.app = app;
        this.size = size ? size : {
            width: 20,
            height: 40
        };
        this.coords = coords ? coords : {
            x: 0,
            y: 0
        };
        this.isFliped = false;
        this.angle = angle ?? 0;
        this.rotationSpeed = rotationSpeed ?? 0.07;
        this.value = [...value];
        this.no_update = false;
        this.no_draw = false;
        this.img = new Image((this.size.width), (this.size.height));
        this.img.src = './assets/images/grid.png';
    }


    /**
     * Draw and Update methods
     */
    shape() {
        const rad = Math.hypot(this.size.width, this.size.height) / 2;
        const alpha = Math.atan2(this.size.width, this.size.height);
        return [
            {
                x: this.coords.x - Math.sin(this.angle - alpha) * rad,
                y: this.coords.y - Math.cos(this.angle - alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(this.angle) * rad * 0.9,
                y: this.coords.y - Math.cos(this.angle) * rad * 0.9
            },
            {
                x: this.coords.x - Math.sin(this.angle + alpha) * rad,
                y: this.coords.y - Math.cos(this.angle + alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(Math.PI + this.angle - alpha) * rad,
                y: this.coords.y - Math.cos(Math.PI + this.angle - alpha) * rad
            },
            {
                x: this.coords.x - Math.sin(Math.PI + this.angle + alpha) * rad,
                y: this.coords.y - Math.cos(Math.PI + this.angle + alpha) * rad
            }
        ]
    }

    update() {
        if (!this.no_update && this.app.game.state.state === PLAY || this.app.game.state.state === GAME_OVER) {
            this.app.gui.get.createPolygon(this);
        }
    }

    draw() {
        if (!this.no_draw && this.app.game.state.state === PLAY || this.app.game.state.state === GAME_OVER) {
            this.app.gui.get.drawPolygon(this.app.gui.ctx, this);
            // this.app.gui.get.drawImage(this.app.gui.ctx, this, 45, 60);
            // (this.amount < this.initialSize) &&
            // this.app.gui.get.bar({
            //     ctx: this.app.gui.ctx,
            //     x: this.coords.x - this.initialSize / 2,
            //     y: this.coords.y - this.height * 1.3,
            //     fillColor: 'red-green',
            //     barColor: 'rgba(0,0,0,0.5)',
            //     cap: this.initialSize,
            //     fill: this.amount,
            //     negative: false
            // });
        }
    }
}