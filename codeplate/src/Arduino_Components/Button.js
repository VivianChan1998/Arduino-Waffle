import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, PinType } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";

class Button extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE_ONLY_DIGITAL,
            init: 0,
            question: <Question handleAnswer = {this.updateAnswer}
                                    questionText = "What kind of input does the button take?"
                                    answerType = {AnswerType.MULTI_OPTION}
                                    answerOption = {
                                        [
                                            Answer("when button is pressed for once", "press"),
                                            Answer("when button is held down", "held"),
                                            Answer("when button is not pressed", "not")
                                        ]
                                    }
                                    />,
        }
    }

    getName = () => { return "Button" }

    updateAnswer = (answer) => {
        this.setState({mode: answer})
    }

    render() {
        return (
            <div>
                {this.state.question}
                {this.state.mode}
            </div>
        );
    }
}

export default Button;
