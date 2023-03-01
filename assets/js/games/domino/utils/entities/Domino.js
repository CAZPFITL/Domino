import {GAME_OVER, PLAY} from "../../env.js";

export const dominoSize = {
    width: 40,
    height: 80
}

const _default = [false,false]

export default class Domino {
    constructor({id = 0, app, size = _default, coords = _default, value}) {
        const [x, y, width, height] = [
            (coords[0] ? coords[0] : 400),
            (coords[1] ? coords[1] : 200),
            (size[0] ? size[0] : dominoSize.width),
            (size[1] ? size[1] : dominoSize.height)
        ];

        this.id = id;

        this.app = app;
        this.isFliped = false;

        this.frameCounter = id;
        this.value = [...value];
        this.img = new Image(width, height);
        this.img.src = './assets/images/Fichas1.png';

        this.body = Matter.Bodies.rectangle(x, y, width, height);
        this.size = dominoSize

        Matter.Composite.add(app.matter.engine.world, [this.body]);
    }

    draw() {
        if (!this.no_draw && this.app.game.state.state === PLAY || this.app.game.state.state === GAME_OVER) {
            if (this.isFliped) {
                this.app.gui.get.drawPolygon(this.app.gui.ctx, this);
            } else {
                this.app.gui.get.drawImage(this.app.gui.ctx, this, 400, 800);
            }
        }
    }
}