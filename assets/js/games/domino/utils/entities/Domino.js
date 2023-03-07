import {GAME_OVER, PLAY_GAME} from "../../env.js";

export const dominoSize = {
    width: 40,
    height: 80
}

const _default = [false,false]

export default class Domino {
    constructor({id = 0, app, size = _default, coords = _default, value}) {
        const [x, y, width, height] = [
            (coords[0] ? coords[0] : Math.random() * 200),
            (coords[1] ? coords[1] : Math.random() * 200),
            (size[0] ? size[0] : dominoSize.width),
            (size[1] ? size[1] : dominoSize.height)
        ];

        this.id = id;

        this.app = app;
        this.isFliped = false;

        this.frameCounter = id;
        this.value = [...value];
        this.img = new Image(width, height);
        this.img.src = './assets/images/Fichas4.png';

        const options = {
            frictionStatic: 10,
            frictionAir: 10,
            friction: 10,
            density: 10,
            mass: 10
        }

        this.body = Matter.Bodies.rectangle(x, y, width, height, {angle: Math.random() * 8}, options);
        this.size = {width, height}

        Matter.Composite.add(app.physics.world, [this.body]);
    }

    draw() {
        if (this.app.game.state.state === PLAY_GAME || this.app.game.state.state === GAME_OVER) {
            if (this.isFliped) {
                this.app.gui.get.drawPolygon(this.app.gui.ctx, this);
            } else {
                this.app.gui.get.drawImage(this.app.gui.ctx, this, 400, 800);
            }
        }
    }
}