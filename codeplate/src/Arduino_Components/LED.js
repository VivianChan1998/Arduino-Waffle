import React from "react";
import Component from "./Tools/Components.js";
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
                                    questionText={"How many LED units are there on LED strip number " +  props.id + "?"}
                                    answerType = {AnswerType.NUMERICAL} />,
            question: <Question handleAnswer = {this.updateAnswer}
                                questionText={`What kind of pattern do you want LED strip number ${props.id} to show?`}
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "all LEDs should show the same color",
                                        value: "color",
                                        followup: <Question handleAnswer = {this.updateColor}
                                                            questionText="What color do you want?" //TODO: example in input box
                                                            answerType={AnswerType.COLOR} />
                                    },
                                    {
                                        text: "all LEDs should cycle through rainbow colors",
                                        value: "rainbow",
                                        followup: ""
                                    }
                                ]} />,
            questionAnalog: <Question handleAnswer = {this.updateColor}
                                questionText="What color do you want?"
                                answerType={AnswerType.COLOR} />,
            code: new Code(),
            init: 0,
            mode: '',
            color: '',
            isAnalog: 0

        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
        //this.props.handlePropsChange({init: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(answer),
            setup: this.getSetup(),
        });
    }
    updateAnswer = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({question: followUp})
        }
        //this.props.handlePropsChange({mode: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            looplogic: this.getLoopLogic(answer, ''),
            helper: this.getHelperFunction(answer),
            analogOutputFunction: this.getAnalogOutputFunction(), // Fixing incorrect assignment syntax
        });
    }
    updateColor = (answer) => {
        this.setState({color: answer})
        //this.props.handlePropsChange({color: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            looplogic: this.getLoopLogic(this.state.mode, answer),
            helper: this.getHelperFunction(this.state.mode),
            analogOutputFunction: this.getAnalogOutputFunction()
        });
    }

    getName = () => { return "LED" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar = (num) => {
        return [
            this.state.code.strInclude(this.state.library),
            this.state.code.strDefine(this.state._pin, 9), //temp
            this.state.code.strDefine(this.state._num, num),
            `Adafruit_NeoPixel ${this.state._objName} = Adafruit_NeoPixel(${this.state._num}, ${this.state._pin}, NEO_GRB + NEO_KHZ800);`
        ];
    }

    getSetup = () => {
        return [`${this.state._objName}.begin();`];
    }

    getLoopLogic = (mode, color) => {
        switch (mode) {
            case "color":
                var hex1 = parseInt(`${color[1]}${color[2]}`, 16);
                return [`colorWipe(${this.state._objName}.Color(${hex1}, ${color[3]}${color[4]}, ${color[5]}${color[6]}), 50);`];
            case "rainbow":
                return [`theaterChaseRainbow(${this.state._objName}, 50);`];
            default:
                return [];
        }
    }

    getAnalogOutputFunction = (reverse = false) => {
        var brightness = `map(${this.props.paramName}, 0, 1023, 0, ${this.props.paramMax});`
        if (reverse) {
            brightness = "1023 - " + brightness;
        }
        const color = this.state.color;
        return [
            `float brightness = ${brightness};`,
            `${this.state._objName}.setBrightness(brightness);`,
            `colorWipe(${this.state._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`
        ];

    }

    getHelperFunction(mode) {
        if (mode === "rainbow") {
            return [
                "void theaterChaseRainbow(int wait) {",
                "  int firstPixelHue = 0;",
                "  for(int a = 0; a < 30; a++) {",
                "    for(int b = 0; b < 3; b++) {",
                `      ${this.state._objName}.clear();`,
                `      for(int c = b; c < ${this.state._objName}.numPixels(); c += 3) {`,
                `        int hue = firstPixelHue + c * 65536L / ${this.state._objName}.numPixels();`,
                `        uint32_t color = ${this.state._objName}.gamma32(${this.state._objName}.ColorHSV(hue));`,
                `        ${this.state._objName}.setPixelColor(c, color);`,
                "      }",
                `      ${this.state._objName}.show();`,
                "      delay(wait);",
                "      firstPixelHue += 65536 / 90;",
                "    }",
                "  }",
                "}"
            ];
        } else {
            return [
                "void colorWipe(uint32_t color, int wait) {",
                `  for(int i = 0; i < ${this.state._objName}.numPixels(); i++) {`,
                `    ${this.state._objName}.setPixelColor(i, color);`,
                `    ${this.state._objName}.show();`,
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
        if (this.props.isAnalog) {
            return (
                <div>
                    {this.state.questionAnalog}
                </div>
            )
        }
        return (
            <div>
                {this.state.question}
            </div>
        );
    }
}

export default LED;
