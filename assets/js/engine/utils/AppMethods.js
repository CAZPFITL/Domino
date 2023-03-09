import Stats from "./gui/Stats.js";
import Camera from "./gui/Camera.js";
import Gui from "./gui/Gui.js";
import Tools from "./helpers/Tools.js";
import States from "./patterns/State.js";
import Factory from "./patterns/Factory.js";
// import Physics from "./components/Physics.js";
import Controls from "./components/Controls.js";
import MusicBox from "./components/MusicBox.js";
import Log from "./components/Log.js";

const pl = window.planck;

export default class AppMethods {
    constructor(Game, verbose) {
        this.loadStats(verbose)
        this.loadClasses()
        this.loadPhysics()
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
        this.physics = {
            world: undefined,
            processBody: (_this, fixture = false) => {
                _this.fixture = fixture;
            }
        };
        this.physics.world = new pl.World(pl.Vec2(0,-100));

    }

    loadGame(Game){
        this.state.setState('LOAD_GAME');
        this.game = new Game(this);
        this.game.useMusicBox && (this.musicBox = new MusicBox(this));
        this.state.setState('LOADED');
    }

    update() {
        this.physics.world.step(1 / 60);
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