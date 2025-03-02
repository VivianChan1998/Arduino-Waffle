import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
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
                                            {
                                                text: "when button is pressed for once",
                                                value: "press",
                                                followup: ""
                                            },
                                            {
                                                text: "when button is held down",
                                                value: "held",
                                                followup: ""
                                            },
                                            {
                                                text: "when button is not pressed",
                                                value: "not",
                                                followup: ""
                                            }
                                        ]
                                    }
                                    />,
        }
    }

    getName = () => { return "Button" }

    updateAnswer = (answer) => {
        this.setState()
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode(this.getGlobalVar(), this.getSetup(), this.getLoopLogic(), this.getHelperFunction())
    }

    getGlobalVar() {
        return []
    }
    getSetup() {
        return []
    }
    getLoopLogic() {
        return []
    }
    getHelperFunction() {
        return []
    }

    render() {
        if (this.props.getStage() === STAGE.RENDER_CODE) {
            return (
                <>
                </>
            )
        }
        return (
            <div>
                {this.state.question}
            </div>
        );
    }
}

export default Button;
