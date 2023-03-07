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
        this.physics.mouse = Matter.Mouse.create(this.game?.gui.controlsCtx.canvas);
        this.physics.mouseConstraint = Matter.MouseConstraint.create(
            this.physics.engine, {
                mouse: this.physics.mouse,
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        );

        Matter.Composite.add(this.physics.world, this.physics.mouseConstraint);

        const updateMousePosition = (e) =>
            console.log('e')
            this.physics.mouse.position = this.gui.get.viewportCoords(this.physics.mouse.position, this.camera.viewport);

        // Matter.Events.on(this.physics.engine, "beforeUpdate", (e)=>{
        //     console.log(e)
        //     e.source.events.beforeUpdate
        // })
        // Matter.Mouse.setScale(this.physics.mouse, scale)
        // Matter.Mouse.setOffset(this.physics.mouse, translation)
        Matter.Events.on(this.physics.mouseConstraint, "startdrag", updateMousePosition)
        Matter.Events.on(this.physics.mouseConstraint, "mousemove", updateMousePosition)
        Matter.Events.on(this.physics.mouseConstraint, "enddrag", updateMousePosition)
        Matter.Events.on(this.physics.mouseConstraint, "mouseup", updateMousePosition)
        Matter.Events.on(this.physics.mouseConstraint, "mousedown", updateMousePosition)
        Matter.Events.on(this.physics.engine, "afterUpdate", (e)=>{
            // Matter.Mouse.setScale(this.physics.mouse, this.camera.viewport.scale)
            // Matter.Mouse.setOffset(this.physics.mouse, translation)
        })
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