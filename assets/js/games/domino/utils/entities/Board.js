import {GAME_OVER, PLAY_GAME} from "../../env.js";

const _default = [false, false]

const pl = window.planck;

class Wall {
    fixture
    body
    position
    shape
    vertices
    constructor(app, edge1, edge2){
        let wall = app.physics.world.createBody();

        //TODO Create wall class
        this.fixture = wall.createFixture(pl.Edge(edge1, edge2), 0.0);
        this.body = this.fixture.m_body;
        this.position = this.body.c_position;
        this.shape = this.fixture.m_shape;
        this.vertices = [
            this.shape.m_vertex1,
            this.shape.m_vertex2
        ]
    }
}

export default class Board {
    bodyParts
    constructor({app, size = _default, coords = _default}) {
        const [x, y, width, height] = [
            (coords[0] ? coords[0] : -750),
            (coords[1] ? coords[1] : -750),
            (size[0] ? size[0] : 1500),
            (size[1] ? size[1] : 1500)
        ];

        this.app = app;
        this.color = '#523f32'

        this.img = new Image(width, height);
        this.img.src = './assets/images/Board1.png';


        this.bodyParts = [
            new Wall(this.app, pl.Vec2(-400.0, -400.0), pl.Vec2(400.0, -400.0)),
            new Wall(this.app, pl.Vec2(-400.0, 400.0), pl.Vec2(400.0, 400.0)),
            new Wall(this.app, pl.Vec2(-400.0, -400.0), pl.Vec2(-400.0, 400.0)),
            new Wall(this.app, pl.Vec2(400.0, -400.0), pl.Vec2(400.0, 400.0)),
            new Wall(this.app, pl.Vec2(-400.0, -400.0), pl.Vec2(400.0, -200.0))
        ];
        console.log(this.bodyParts)

    }

    draw() {
        this.bodyParts.forEach((part)=>{
            // console.log(part)
            for (let fixture = part.body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                this.app.gui.get.drawPlPolygon(this.app.gui.ctx, part)
            }
        })
    }
}