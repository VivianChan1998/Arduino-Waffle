import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, PinType } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";

class LED extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.OUTPUT_DEVICE,
            library: "Adafruit_NeoPixel.h",
            init: 0,
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText="How many LEDs are there on this strip?"
                                    answerType = {AnswerType.NUMERICAL} />
        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
    }

    getName = () => { return "LED" }

    render() {
        return (
            <div>
                {this.state.initQuestion}
                {this.state.init}
            </div>
        );
    }
}

export default LED;
