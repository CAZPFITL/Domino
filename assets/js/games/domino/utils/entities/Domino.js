import {GAME_OVER, PLAY_GAME} from "../../env.js";

export const dominoSize = {
    width: 40,
    height: 80
}

const _default = [false,false]

const pl = window.planck;

export default class Domino {

    id
    app
    frameCounter
    states
    img
    fixture
    body
    shape
    normals
    vertices

    constructor({id = 0, app, size = _default, coords = _default, value}) {
        this.id = id;
        this.app = app;
        this.frameCounter = id;
        const [x, y, width, height] = [
            (coords[0] ? coords[0] : 0),
            (coords[1] ? coords[1] : 0),
            (size[0] ? size[0] : dominoSize.width),
            (size[1] ? size[1] : dominoSize.height)
        ];
        this.states = {
            isFlipped: true,
            value: [...value]
        }
        this.img = new Image(width, height);
        this.img.src = './assets/images/Fichas4.png';
        this.fixture = this.app.physics.world.createDynamicBody(pl.Vec2(x, y)).createFixture(pl.Box(width, height), 5.0);

        this.body = this.fixture.m_body;
        this.position = this.body.c_position;
        this.shape = this.fixture.m_shape;
        this.vertices = this.shape.m_vertices;
    }

    draw() {
        if (this.app.game.state.state === PLAY_GAME || this.app.game.state.state === GAME_OVER) {
            if (this.states.isFlipped) {
                for (let fixture = this.body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                    this.app.gui.get.drawPlPolygon(this.app.gui.ctx, this)
                }
            }
        }
    }
}