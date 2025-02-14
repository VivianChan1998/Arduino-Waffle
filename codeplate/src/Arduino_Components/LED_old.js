import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, PinType } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";

class LED extends Component {
    constructor(id, board) {
        super(id, board);
        this.name = "LED";
        this.deviceType = ComponentType.OUTPUT_DEVICE;
        this.library = "Adafruit_NeoPixel.h";
        this.initQuestion = new Question(this.init, "number", "How many LEDs are there on this strip?", AnswerType.NUMERICAL);
        
        const followUpColor = new Question(this.parameter, "color", "What color should the LEDs turn into?", AnswerType.TEXT);
        this.question = new Question(this.parameter, "mode", "What kind of pattern do you want it to show?",
            AnswerType.MULTI_OPTION, [
                new Answer("Turn into one color", "color", followUpColor),
                new Answer("Do a rainbow pattern circulation", "rainbow")
            ]
        );
        
        this.questionAnalog = new Question(this.parameter, "mode", "What kind of pattern do you want it to show?",
            AnswerType.MULTI_OPTION, [
                new Answer("Turn into one color with brightness varied on input", "color", followUpColor)
            ]
        );
        
        this.pinSpec = [PinType.DIGITAL];
        this.pinReg = this.board.registerDevice(this.name, this.pinSpec);
        this._pin = `led${id}_pin`;
        this._num = `led${id}_num`;
        this._objName = `pixels_${id}`;
        this.analogMax = 255;
    }
    getinitQuestion = () => {
        return this.initQuestion
    }
    

    getGlobalVar() {
        return [
            this.strDefine(this._pin, this.pinReg[0]),
            this.strDefine(this._num, this.init["number"]),
            `Adafruit_NeoPixel ${this._objName} = Adafruit_NeoPixel(${this._num}, ${this._pin}, NEO_GRB + NEO_KHZ800);`
        ];
    }

    getSetup() {
        return [`${this._objName}.begin();`];
    }

    getLoopLogic(stateNum = 0) {
        const state = this.states[stateNum];
        switch (state["mode"]) {
            case "color":
                const color = state["color"];
                return [`colorWipe(${this._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`];
            case "rainbow":
                return [`theaterChaseRainbow(${this._objName}, 50);`];
            default:
                return "";
        }
    }

    getLoopLogicAnalog(stateNum, param, paramMax, reverse = false) {
        let brightness = `int(${this.analogMax} / ${paramMax} * ${param})`;
        if (reverse) {
            brightness = `${this.analogMax} - ${brightness}`;
        }
        const color = this.states[stateNum]["color"];
        return [
            `${this._objName}.setBrightness(${brightness});`,
            `colorWipe(${this._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`
        ];
    }

    getHelperFunction(stateNum = 0) {
        const state = this.states[stateNum];
        if (state["mode"] === "rainbow") {
            return [
                "void theaterChaseRainbow(int wait) {",
                "  int firstPixelHue = 0;",
                "  for(int a = 0; a < 30; a++) {",
                "    for(int b = 0; b < 3; b++) {",
                "      pixels.clear();",
                "      for(int c = b; c < pixels.numPixels(); c += 3) {",
                "        int hue = firstPixelHue + c * 65536L / pixels.numPixels();",
                "        uint32_t color = pixels.gamma32(pixels.ColorHSV(hue));",
                "        pixels.setPixelColor(c, color);",
                "      }",
                "      pixels.show();",
                "      delay(wait);",
                "      firstPixelHue += 65536 / 90;",
                "    }",
                "  }",
                "}",
                "led_rainbow"
            ];
        } else {
            return [
                "void colorWipe(uint32_t color, int wait) {",
                "  for(int i = 0; i < pixels.numPixels(); i++) {",
                "    pixels.setPixelColor(i, color);",
                "    pixels.show();",
                "    delay(wait);",
                "  }",
                "}",
                "led_color"
            ];
        }
    }
}