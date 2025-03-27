import React from "react";
import Component from "./Tools/Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class Serial extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE_ONLY_DIGITAL,
            init: 0,
            question: <Question handleAnswer = {this.updateAnswer}
                                    questionText = {`Do you want to show printed out information from components on the Serial Monitor?`}
                                    answerType = {AnswerType.MULTI_OPTION}
                                    answerOption = {
                                        [
                                            {
                                                text: "Yes",
                                                value: "yes",
                                                followup: ""
                                            },
                                            {
                                                text: "No",
                                                value: "No",
                                                followup: ""
                                            }
                                        ]
                                    }
                                    />,
            code: new Code()
        }
    }

    getName = () => { return "Serial" }

    updateAnswer = (answer) => {
        this.setState({mode: answer})
        this.props.handleSerial(answer)
    }
    
    render() {
        if (this.props.getStage() === STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.question}
                </div>
            );
        }
    }
}

export default Serial;
