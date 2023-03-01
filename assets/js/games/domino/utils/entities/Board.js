import {GAME_OVER, PLAY} from "../../env.js";

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

        // this.body = Matter.Bodies.rectangle(x, y, width, height);
        this.body = {
            position: {x, y},
            angle: 0
        }
        this.size = {width, height}
        this.bodyParts = [
            Matter.Bodies.rectangle(0, y, width, 20, {isStatic: true}),
            Matter.Bodies.rectangle(0, -y, width, 20, {isStatic: true}),
            Matter.Bodies.rectangle(x, 0, 20, height, {isStatic: true}),
            Matter.Bodies.rectangle(-x, 0, 20, height, {isStatic: true}),
        ]

        Matter.Composite.add(app.matter.engine.world, this.bodyParts);
    }

    draw() {
        if (!this.no_draw && this.app.game.state.state === PLAY || this.app.game.state.state === GAME_OVER) {
            const bodies = this.bodyParts;
            const context = this.app.gui.ctx;
            // this.app.gui.get.drawImage(this.app.gui.ctx, this, 1500, 1500);
            for (var i = 0; i < bodies.length; i += 1) {
                context.lineWidth = 20;
                context.strokeStyle = '#999';
                this.app.gui.get.drawPolygon(context, bodies[i], 'stroke');
                context.lineWidth = 1;
                context.strokeStyle = '#000';
            }
        }
    }
}