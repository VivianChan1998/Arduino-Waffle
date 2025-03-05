import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class LED extends Component {
    constructor(props){
        super(props)
        this.state = {
            _pin: `led${props.id}_pin`,
            _num: `led${props.id}_num`,
            _objName: `led${props.id}`,
            deviceType: ComponentType.OUTPUT_DEVICE,
            library: "Adafruit_NeoPixel.h",
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText={"How many LED units are there on the LED strip: " + `led${props.id}` + "?"}
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
            code: new Code(),
            init: 0,
            mode: '',
            color: ''

        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
        this.props.handlePropsChange({init: answer}, this.props.id, "OUTPUT")
    }
    updateAnswer = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({question: followUp})
        }
        this.props.handlePropsChange({mode: answer}, this.props.id, "OUTPUT")
        this.props.handleCode("OUTPUT", this.props.id, this.getGlobalVar(), this.getSetup(), [], this.getLoopLogic(), this.getHelperFunction())
    }
    updateColor = (answer) => {
        this.setState({color: answer})
        this.props.handlePropsChange({color: answer}, this.props.id, "OUTPUT")
        this.props.handleCode("OUTPUT", this.props.id, this.getGlobalVar(), this.getSetup(), [], this.getLoopLogic(), this.getHelperFunction())
    }

    getName = () => { return "LED" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar = () => {
        return [
            this.state.code.strDefine(this.state._pin, 9), //temp
            this.state.code.strDefine(this.state._num, this.state.init),
            `Adafruit_NeoPixel ${this.state._objName} = Adafruit_NeoPixel(${this.state._num}, ${this.state._pin}, NEO_GRB + NEO_KHZ800);`
        ];
    }

    getSetup = () => {
        return [`${this.state._objName}.begin();`];
    }

    getLoopLogic = () => {
        switch (this.state.mode) {
            case "color":
                const color = this.state.color;
                return [`colorWipe(${this.state._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`];
            case "rainbow":
                return [`theaterChaseRainbow(${this.state._objName}, 50);`];
            default:
                return [];
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
                "}"
            ];
        } else {
            return [
                "void colorWipe(uint32_t color, int wait) {",
                "  for(int i = 0; i < pixels.numPixels(); i++) {",
                "    pixels.setPixelColor(i, color);",
                "    pixels.show();",
                "    delay(wait);",
                "  }",
                "}"
            ];
        }
    }

    render() {
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                </div>
            );
        }
        if (this.props.getStage() == STAGE.RENDER_CODE) {
            
            return (
                <>
                </>
            );
        }
        return (
            <div>
                {this.state.question}
            </div>
        );
    }
}

export default LED;
