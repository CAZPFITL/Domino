import Stats from "./gui/Stats.js";
import Camera from "./gui/Camera.js";
import Gui from "./gui/Gui.js";
import Tools from "./helpers/Tools.js";
import States from "./patterns/State.js";
import Factory from "./patterns/Factory.js";
import Physics from "./components/Physics.js";
import Controls from "./components/Controls.js";
import MusicBox from "./components/MusicBox.js";
import Log from "./components/Log.js";

export default class AppMethods {
    constructor(Game, verbose) {
        this.loadStats(verbose)
        this.loadClasses()
        this.loadPhysics()
        this.loadInteractions()
        this.loadGame(Game)
    }

    loadClasses(){
        this.updateCallbacks = [];
        this.gameSpeed = 1;
        this.tools = Tools;
        this.log = new Log(this);
        this.state = new States(this, this, 'LOAD_ENGINE', ['LOAD_ENGINE', 'LOAD_GAME', 'LOADED']);
        this.controls = new Controls(this);
        this.factory = new Factory(this);
        this.gui = new Gui(this);
        this.camera = new Camera(this);
        this.request = requestAnimationFrame(this.camera.loop);
    }

    loadStats(verbose){
        this.verbose = verbose
        this.stats = new Stats();
        // load Stats
        !verbose && (()=> {
            this.stats.isShowing = !this.stats.isShowing;
            this.stats.dom.style.display = this.stats.isShowing ? 'block' : 'none';
            document.body.appendChild(this.stats.dom);
        })()
    }

    loadPhysics(){
        // Load Physics Engine
        //     this.physics = new Physics(this);
        this.physics = {engine: Matter.Engine.create()};
        // Load Physics World
        this.physics.world = this.physics.engine.world;
    }

    loadGame(Game){
        this.state.setState('LOAD_GAME');
        this.game = new Game(this);
        this.game.useMusicBox && (this.musicBox = new MusicBox(this));
        this.state.setState('LOADED');
    }

    loadInteractions() {
        // Matter.Events.on(this.physics.engine, "afterUpdate", (e)=> {

        // this.physics.mouseConstraint = Matter.MouseConstraint.create(
        //     this.physics.engine, {
        //         stiffness: 0.2,
        //         render: {
        //             visible: false
        //         }
        //     }
        // );
        // this.physics.mouse = this.physics.mouseConstraint.mouse;
        //
        // Matter.Composite.add(this.physics.world, this.physics.mouseConstraint);
        //
        // console.log(this.physics.mouseConstraint)
        //
        // Matter.Events.on(this.physics.engine, "afterUpdate", (e)=> {
        //     Matter.Mouse.clearSourceEvents(this.physics.mouse)
        //     const bodies = this.physics.world.bodies ?? [];
        //
        //     const mouseTranslatedPosition = this.gui.get.viewportCoords(this.physics.mouse.position, this.camera.viewport)
        //     this.physics.mouse.position = mouseTranslatedPosition
        //
        //     bodies.forEach((body, i)=>{
        //         if (Matter.Bounds.contains(body.bounds, this.physics.mouse)) {
        //             console.log(1, body.position);
        //             console.log(2, this.physics.mouse.position);
        //             console.log('12312312312312312')
        //             for (let j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
        //                 let part = body.parts[j];
        //                 if (Matter.Vertices.contains(part.vertices, mouseTranslatedPosition)) {
        //                     // let mouseConstraint = this.physics.mouseConstraint
        //                     // mouseConstraint.pointA = mouseTranslatedPosition;
        //                     // mouseConstraint.bodyB = mouseConstraint.body = body;
        //                     // mouseConstraint.pointB = { x: mouseTranslatedPosition.x - body.position.x, y: mouseTranslatedPosition.y - body.position.y };
        //                     // mouseConstraint.angleB = body.angle;
        //                     //
        //                     // Matter.Sleeping.set(body, false);
        //                     // Matter.Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });
        //                     //
        //                     break;
        //                 }
        //             }
        //         }
        //     })
        // console.log(1, this.physics.world.bodies[4])
        // console.log(2, this.physics.mouse.position)
        // this.physics.mouse.mousedownPosition = this.gui.get.viewportCoords(this.physics.mouse.mousedownPosition, this.camera.viewport);
        // this.physics.mouse.mouseupPosition   = this.gui.get.viewportCoords(this.physics.mouse.mouseupPosition, this.camera.viewport);
        // Matter.Mouse.setOffset(this.physics.mouse, {
        //     x: this.camera.viewport.left * this.camera.viewport.scale.x,
        //     y: this.camera.viewport.top * this.camera.viewport.scale.y
        // })
        // // this.physics.mouse.pointA   = this.gui.get.viewportCoords(this.physics.mouse.pointA, this.camera.viewport);
        // // this.physics.mouse.pointB   = this.gui.get.viewportCoords(this.physics.mouse.pointB, this.camera.viewport);
        // })
    }

    update() {
        Matter.Engine.update(this.physics.engine, 1000 / 60);
        for (let key in this.factory.binnacle) {
            if (this.factory.binnacle[key] instanceof Array) {
                for (let i = 0; i < this.factory.binnacle[key].length; i++) {
                    (Boolean(this.factory.binnacle[key][i].update)) &&
                    this.factory.binnacle[key][i].update();
                }
            }
        }
    }

    draw() {
        for (let key in this.factory.binnacle) {
            if (this.factory.binnacle[key] instanceof Array) {
                for (let i = 0; i < this.factory.binnacle[key].length; i++) {
                    (Boolean(this.factory.binnacle[key][i].draw)) &&
                    this.factory.binnacle[key][i].draw(this.gui.ctx);
                }
            }
        }
    }
}