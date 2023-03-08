import {
    COLORS
} from "../../env.js";

export default class Screen {
    constructor(app, gui) {
        this.app = app;
        this.gui = gui;
        this.hoverCollection = {};
        this.decorations = {};
        this.buttonsStates = {};
        this.buttonsCollection = {};
        this.abstractStates = {
            bodyToDrag: false
        };
        this.screenData = () => this.declareElements();
        this.addListeners({
            mousemove: (event, hoverTranslatedCoords) => {
                // MOVE Domino
                if (this.abstractStates.bodyToDrag) {
                    const body = this.abstractStates.bodyToDrag.body;
                    (body.position = hoverTranslatedCoords);
                }
            },
            mouseup: () => {
                this.abstractStates.bodyToDrag = false;
            },
            mousedown: (event, hoverTranslatedCoords) => {
                this.abstractStates.bodyToDrag = this.app.gui.get.entityAt(hoverTranslatedCoords, this.app.factory.binnacle?.Domino) ?? false
            },
            click: () => true,
        });
    }

    declareElements() {
        this.colors = {
            MAIN_MENU: {
                background: '#4c8f9d',
                buttons: {
                    variation1: {
                        color: '#2c2c2c',
                        hover: '#afafaf',
                        click: '#868686',
                        normal: '#e3e3e3',
                        stroke: '#022936',
                    }
                },
                mainCard: {
                    text: '#003d54',
                    background: '#a7b2b7',
                    color: '#022936',
                }
            },
            PLAY: {
                background: '#a7b2b7',
            }
        };

        const mainMenuButtonMeasure = {
            width: 300,
            height: 50
        };

        const mainMenuButtonBase = {
            x: -(mainMenuButtonMeasure.width / 2),
            y: -70,
            space: -20,
            ...mainMenuButtonMeasure
        };

        const mainMenuCardSize = {
            width: mainMenuButtonMeasure.width + 150,
            height: 300,
        };

        // const height = 190;
        //
        // const width = 400;
        //
        // const cardPosition = {x: 10, y: 10};

        const displacement = (mainMenuButtonBase.height + mainMenuButtonBase.space);

        this.buttonsCollection = {
            MAIN_MENU: {
                start: {
                    type: 'button',
                    props: {
                        position: 'viewport',
                        ctx: this.app.gui.ctx,
                        color: this.colors.MAIN_MENU.buttons.variation1.color,
                        ...mainMenuButtonBase,
                        x: mainMenuButtonBase.x,
                        y: mainMenuButtonBase.y,
                        text: 'Start',
                        font: '16px Mouse',
                        bg: this.buttonsStates.start === 'hover' ? this.colors.MAIN_MENU.buttons.variation1.hover
                            : this.buttonsStates.start === 'click' ? this.colors.MAIN_MENU.buttons.variation1.click
                                : this.colors.MAIN_MENU.buttons.variation1.normal,
                        stroke: this.colors.MAIN_MENU.buttons.variation1.stroke,
                        widthStroke: 8,
                        callbacks: {
                            mouseup: () => {
                                this.app.game.state.setState('LOADING');
                                // this.app.game.useMusicBox && this.app.musicBox.play();
                            }
                        }
                    }
                },
                login: {
                    type: 'button',
                    props: {
                        position: 'viewport',
                        ctx: this.app.gui.ctx,
                        ...mainMenuButtonBase,
                        x: mainMenuButtonBase.x,
                        y: mainMenuButtonBase.y + (displacement * 3),
                        text: 'Login',
                        font: '16px Mouse',
                        bg: this.buttonsStates.login === 'hover' ? COLORS.BLACK[5]
                            : this.buttonsStates.login === 'click' ? COLORS.BLACK[5]
                                : COLORS.BLACK[6],
                        stroke: this.colors.MAIN_MENU.buttons.variation1.stroke,
                        widthStroke: 8
                    }
                },
            },
            PLAY: {
                sound: {
                    type: 'button',
                    props: {
                        position: 'controls',
                        ctx: this.app.game.gui.controlsCtx,
                        x: this.gui.controlsCtx.canvas.width - 60,
                        y: 190,
                        width: 50,
                        height: 50,
                        text: '🔈',
                        font: '16px Mouse',
                        bg: this.buttonsStates.sound === 'hover' ? this.colors.MAIN_MENU.buttons.variation1.hover
                            : this.buttonsStates.sound === 'click' ? this.colors.MAIN_MENU.buttons.variation1.click
                                : this.colors.MAIN_MENU.buttons.variation1.normal,
                        stroke: this.colors.MAIN_MENU.buttons.variation1.stroke,
                        widthStroke: 2,
                        callbacks: {
                            click: () => this.app.musicBox.song.song.volume = !this.app.musicBox.song.song.volume
                        }
                    }
                }
            }
        };

        this.decorations = {
            MAIN_MENU: {
                main_card: {
                    type: 'square',
                    props: {
                        ctx: this.app.gui.ctx,
                        x: -(mainMenuCardSize.width / 2),
                        y: -(mainMenuCardSize.height / 1.55),
                        ...mainMenuCardSize,
                        color: this.colors.MAIN_MENU.mainCard.background,
                        stroke: this.colors.MAIN_MENU.mainCard.color,
                        widthStroke: 5
                    }
                },
                title: {
                    type: 'text',
                    props: {
                        ctx: this.app.gui.ctx,
                        font: '72px Mouse',
                        text: this.app.game.constructor.name,
                        x: 0,
                        y: mainMenuButtonBase.y - 50,
                        // y: -(mainMenuButtonMeasure.height * (Object.keys(this.buttonsCollection.MAIN_MENU).length / 2) + 20),
                        color: this.colors.MAIN_MENU.mainCard.text,
                        width: 0,
                        height: 0,
                        center: true
                    }
                }
            },
            LOADING: {
                title: {
                    type: 'text',
                    props: {
                        ctx: this.app.gui.ctx,
                        font: '72px Mouse',
                        text: 'LOADING GAME...',
                        x: 50,
                        y: mainMenuButtonBase.y + 72,
                        // y: -(mainMenuButtonMeasure.height * (Object.keys(this.buttonsCollection.MAIN_MENU).length / 2) + 20),
                        color: this.colors.MAIN_MENU.mainCard.text,
                        width: 0,
                        height: 0,
                        center: true
                    }
                }
            },
            // PLAY: {
            //     data_card: {
            //         type: 'square',
            //         props: {
            //             ctx: this.app.game.gui.controlsCtx,
            //             x: cardPosition.x,
            //             y: cardPosition.y,
            //             width: width + 35,
            //             height,
            //             color: COLORS.WHITE[4],
            //             stroke: COLORS.BLACK[0]
            //         }
            //     }
            // }
        };
    }

    buttonCollectionEvents(type, hoverTranslatedCoords) {
        const buttons = this.getButtons()

        if (type === 'mousemove') {
            Object.keys(buttons).forEach((key) => {
                buttons[key].props?.callbacks?.mousemove &&
                buttons[key].props.callbacks.mousemove(event, hoverTranslatedCoords)
            });

            this.app.gui.get.checkHoverCollection({
                collection: this.hoverCollection,
                event,
                viewport: this.app.camera.viewport,
                isHover: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'hover') {
                        this.buttonsStates[key] = 'hover';
                        this.hoverCaller = key;
                        this.gui.hoverStateIn();
                    }
                },
                isOut: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'normal') {
                        this.buttonsStates[key] = 'normal';
                        this.hoverCaller = null;
                        this.gui.hoverStateOut();
                    }
                },
                caller: this.hoverCaller,
            });
        }

        if (type === 'mouseup') {
            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mouseup && buttons[key].props.callbacks.mouseup(event)
                )
            });
        }

        if (type === 'mousedown') {
            const buttons = this.getButtons()
            Object.keys(buttons).forEach((key) => {
                if (!buttons[key].props?.ctx) return;
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mousedown && buttons[key].props.callbacks.mousedown(event)
                )
            });
        }

        if (type === 'click') {
            const buttons = this.getButtons()

            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.click && buttons[key].props.callbacks.click(event)
                )
            });
        }
    }

    addListeners(abstractEvents) {
        const translatedCoords = (event) => (this.app.gui.get.viewportCoords({
            x: event.offsetX,
            y: event.offsetY
        }, this.app.camera.viewport));

        this.app.controls.pushListener(this, 'mousemove', (event) => {
            const tc = translatedCoords(event);
            abstractEvents.mousemove(event, tc);
            this.buttonCollectionEvents('mousemove', tc);
        });

        this.app.controls.pushListener(this, 'mouseup', (event) => {
            const tc = translatedCoords(event);
            abstractEvents.mouseup(event, tc);
            this.buttonCollectionEvents('mouseup', tc);
        });

        this.app.controls.pushListener(this, 'mousedown', (event) => {
            const tc = translatedCoords(event);
            abstractEvents.mousedown(event, tc);
            this.buttonCollectionEvents('mousedown', tc);
        });

        this.app.controls.pushListener(this, 'click', (event) => {
            const tc = translatedCoords(event);
            abstractEvents.click(event, tc);
            this.buttonCollectionEvents('click', tc);
        });

    }

    getButtons() {
        const output = {};
        Object.entries(this.buttonsCollection).forEach(key => {
            if (key[0] !== this.app.game.state.state) return;
            Object.entries(key[1]).forEach(button => output[button[0]] = button[1]);
        })
        return output;
    }

    update() {
        this.screenData();
    }

    draw() {
        // DECLARE COLLECTION
        const collection = [
            ...Object.values(this?.decorations[this?.app?.game?.state?.state] ?? {}),
            ...Object.values(this?.buttonsCollection[this?.app?.game?.state?.state] ?? {}),
        ];
        // DRAW COLLECTION
        for (let i = 0; i < collection.length; i++) {
            try {
                const item = collection[i];
                if (typeof this?.app?.gui?.get[item?.type] === 'function') {
                    this.app.gui.get[item.type](item.props);
                }
            } catch (error) {
                console.error(
                    'verify item.props are provided with next keys:' +
                    'position, ctx, x, y, width, height, text, font, bg, stroke, widthStroke, callbacks' +
                    error
                );
                debugger;
            }
        }
        // CLEAR HOVER COLLECTION
        this.hoverCollection = {};
        // HOVER EVENTS
        Object.entries(this.buttonsCollection[this.app.game.state.state] ?? {}).forEach(key => {
            this.hoverCollection[key[0]] = key[1].props;
        });
        // CANVAS BACKGROUND
        if (!this?.colors[this?.app?.game?.state?.state]?.background) return;

        this.app.gui.ctx.canvas.style.backgroundColor = this.colors[this.app.game.state.state].background;
    }
}