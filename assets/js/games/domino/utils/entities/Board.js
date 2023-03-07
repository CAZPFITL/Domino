import {GAME_OVER, PLAY_GAME} from "../../env.js";

const _default = [false, false]

export default class Board {
    constructor({app, size = _default, coords = _default}) {
        const [x, y, width, height] = [
            (coords[0] ? coords[0] : -750),
            (coords[1] ? coords[1] : -750),
            (size[0] ? size[0] : 1500),
            (size[1] ? size[1] : 1500)
        ];

        this.app = app;
        this.color = '#523f32'

        this.frameCounter = 0;
        this.img = new Image(width, height);
        this.img.src = './assets/images/Board1.png';

        this.body = {
            position: {x, y},
            angle: 0
        };

        this.size = {width, height};

        const weight = 5;

        const options = {
            isStatic: true,
            density: 100,
            mass: 100,
            friction: 1,
            restitution: 1,
        }

        this.bodyParts = [
            Matter.Bodies.rectangle(0, y, width, weight, options),
            Matter.Bodies.rectangle(0, -y, width, weight, options),
            Matter.Bodies.rectangle(x, 0, weight, height, options),
            Matter.Bodies.rectangle(-x, 0, weight, height, options),
        ]

        Matter.Composite.add(app.physics.world, this.bodyParts);
    }

    draw() {
        if (!this.no_draw && this.app.game.state.state === PLAY_GAME || this.app.game.state.state === GAME_OVER) {
            const bodies = this.bodyParts;
            const context = this.app.gui.ctx;
            // this.app.gui.get.drawImage(this.app.gui.ctx, this, 1500, 1500);
            for (let i = 0; i < bodies.length; i += 1) {
                context.lineWidth = 10;
                context.strokeStyle = '#999';
                this.app.gui.get.drawPolygon(context, bodies[i], 'stroke');
                context.lineWidth = 1;
                context.strokeStyle = '#000';
            }
        }
    }
}