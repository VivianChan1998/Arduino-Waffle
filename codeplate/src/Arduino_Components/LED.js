import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class LED extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.OUTPUT_DEVICE,
            library: "Adafruit_NeoPixel.h",
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText="How many LEDs are there on this strip?"
                                    answerType = {AnswerType.NUMERICAL} />,
            question: <Question handleAnswer = {this.updateAnswer}
                                questionText="What kind of pattern do you want it to show?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "Turn into one color",
                                        value: "color",
                                        followup: <Question handleAnswer = {this.updateColor}
                                                            questionText="What color do you want?"
                                                            answerType={AnswerType.TEXT} />
                                    },
                                    {
                                        text: "Do a rainbow pattern circulation",
                                        value: "rainbow",
                                        followup: ""
                                    }
                                ]} />, 
            _pin: `led${props.id}_pin`,
            _num: `led${props.id}_num`
        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
    }
    updateAnswer = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({question: followUp})
        }
    }
    updateColor = (answer) => {
        this.setState({color: answer})
    }

    getName = () => { return "LED" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar() {
        return [
            Code.strDefine(this.state._pin, 9), //temp
            Code.strDefine(this.state._num, this.state.init),
            `Adafruit_NeoPixel ${this.state._objName} = Adafruit_NeoPixel(${this.state._num}, ${this.state._pin}, NEO_GRB + NEO_KHZ800);`
        ];
    }

    getSetup() {
        return [`${this.state._objName}.begin();`];
    }

    getLoopLogic(stateNum = 0) {
        switch (this.state.mode) {
            case "color":
                const color = this.state.color;
                return [`colorWipe(${this.state._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`];
            case "rainbow":
                return [`theaterChaseRainbow(${this.state._objName}, 50);`];
            default:
                return "";
        }
    }

    /* TODO

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

    */

    getHelperFunction() {
        if (this.state.mode === "rainbow") {
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

    render() {
        console.log(this.state.mode)
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                    {this.state.init}
                    <button onClick={() => {
                        var p = {
                            init: this.state.init
                        }
                        this.handleAnswer(p)
                    }}>ok!</button>
                </div>
            );
        }
        
        if (this.props.getStage() == STAGE.RENDER_CODE) {
            this.props.handleCode(this.getGlobalVar(), this.getSetup(), this.getLoopLogic(), this.getHelperFunction());
            return (
                <div>
                    <p>LED code</p>
                </div>
            );
        }

        return (
            <div>
                {this.state.question}
                <button onClick={() => {
                    var p = {
                        mode: this.state.mode,
                        color: this.state.color
                    }
                    this.handleAnswer(p)
            }}>ok!</button>
            </div>
        );
    }
}

export default LED;
