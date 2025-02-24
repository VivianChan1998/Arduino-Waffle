import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, PinType } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";

class Ultrasonic extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE,
            init: 0,
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText="What do you want to use this ultrasonic sensor for?"
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [
                                            {
                                                text: "Binary threshold with respect to an output device, one output state under threshold, one output state over threshold.", 
                                                value: "binary threshold",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText="What threshold value do you want?"
                                                                    answerType={AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Use analog input for determining for the output, each different analog value will differently impact state.",
                                                value: "analog direct",
                                                followup: "",
                                                analog: <Question handleAnswer = {this.updateAnalog} />
                                            }
                                        ]
                                    }/>
                                
                                    
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

    updateThreshold = (answer) => {
        this.setState({threshold: answer})
    }

    updateAnalog = (answer) => {
        this.setState({analog: answer})
    }
    getName = () => { return "Ultrasonic" }

    render() {
        return (
            <div>
                {this.state.initQuestion}
                {this.state.init}
            </div>
        );
    }
}

export default Ultrasonic;
