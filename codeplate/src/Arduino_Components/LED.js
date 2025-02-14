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
                                    answerType = {AnswerType.NUMERICAL} />,
            question: <Question handleAnswer = {this.updateAnswer}
                                questionText="What pattern"
                                answerType={AnswerType.NUMERCIAL}/>, //temp
            isInit: false,
            isAnswered: false
        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
    }

    getName = () => { return "LED" }

    render() {
        if (!this.state.isInit) {
            return (
                <div>
                    {this.state.initQuestion}
                    {this.state.init}
                    <button onClick={() => this.setState({isInit: true})}>ok!</button>
                </div>
            );
        }
        return (
            <div>
                {this.state.question}
                <button onClick={() => this.setState({isAnswered: true})}>ok!</button>
            </div>
        );
    }
}

export default LED;
