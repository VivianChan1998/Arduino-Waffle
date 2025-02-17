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
            p: {}
        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
    }
    updateAnswer = (answer, hasFollowup, followUp) => {
        this.setState({answer: answer})
        if (hasFollowup) {
            this.setState({question: followUp})
        }
    }
    updateColor = (answer) => {
        this.setState({color: answer})
    }

    getName = () => { return "LED" }

    handleAnswer = p => {
        console.log("here")
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    render() {
        if (this.props.isInit()) {
            return (
                <div>
                    {this.state.initQuestion}
                    {this.state.init}
                    <button onClick={() => {
                        var p = {
                            init: this.state.init,
                            answer: this.state.answer
                        }
                        this.setState({ p: p })
                        this.handleAnswer(p)
                    }}>ok!</button>
                </div>
            );
        }
        return (
            <div>
                {this.state.question}
                <button onClick={() => {
                    var p = {
                        init: this.state.init,
                        answer: this.state.answer
                    }
                    this.setState({ p: p })
                    this.handleAnswer(p)
            }}>ok!</button>
            </div>
        );
    }
}

export default LED;
