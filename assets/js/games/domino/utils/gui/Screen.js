import ScreenHelpers from '../../../../engine/utils/gui/ScreenHelpers.js'
import {
    COLORS
} from "../../env.js";

export default class Screen extends ScreenHelpers {
    constructor(app, gui) {
        super()
        this.app = app;
        this.gui = gui;
        this.hoverCollection = {};
        this.decorations = {};
        this.buttonsStates = {};
        this.buttonsCollection = {};
        this.abstractStates = {};
        this.screenData = () => this.declareElements();
        this.addListeners({
            mousemove: (event, hoverTranslatedCoords) => {
                // MOVE CREATION
                if (this.abstractStates.creating) {
                    if (this.creation?.coords) {
                        (this.creation.coords = hoverTranslatedCoords);
                    } else {
                        this.creation.x = hoverTranslatedCoords?.x;
                        this.creation.y = hoverTranslatedCoords?.y;
                    }
                }
            },
            mouseup: () => true,
            mousedown: (event) => {
                // PLACE CREATION
                if (this.abstractStates.creating) {
                    const safeGap = 20;
                    const objWidth = (this.creation?.size?.width ?? this.creation.width);
                    const objHeight = (this.creation?.size?.height ?? this.creation.height);
                    const map = {
                        x: (-this.app.game.level.size.width + objWidth) / 2 + safeGap,
                        y: (-this.app.game.level.size.height + objHeight) / 2 + safeGap,
                        width: this.app.game.level.size.width - objWidth - safeGap * 2,
                        height: this.app.game.level.size.height - objHeight - safeGap * 2
                    }
                    const click = this.app.gui.get.viewportCoords(
                        {x: event.offsetX, y: event.offsetY},
                        this.app.camera.viewport
                    );
                    if (this.app.gui.get.isHover(map, click)) {
                        this.creation = null;
                        this.abstractStates.creating = false;
                        this.buttonsStates.createAnthill = 'normal';
                        this.buttonsStates.createFood = 'normal';
                    }
                }
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
}