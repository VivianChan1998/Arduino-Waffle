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
                                            Answer("Binary threshold with respect to an output device, one output state under threshold, one output state over threshold.", "binary threshold"), // add followup threshold
                                            Answer("Use analog input for determining for the output, each different analog value will differently impact state.", "analog direct") // add callback function (.set_analog)
                                        ]
                                    }/>
                                
                                    
        }
    }

    updateInit = (answer) => {
        this.setState({init: answer})
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
