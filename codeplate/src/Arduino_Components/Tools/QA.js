import React from "react";
import { AnswerType } from "./Enums.js";

class Question extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number: 0
        }
    }
    render() {
        return (
            <div>
                <p>{this.props.questionText}</p>
                {
                    this.props.answerType === AnswerType.NUMERICAL ?
                    <input type="text" onChange={ e => this.props.handleAnswer(e.target.value)} /> : "" //TODO more answer types
                }
            </div>
        );
    };
}

const Answer = ({ answerText, value, followUp = null, callbackFunction = null }) => {
    return {
        text: answerText,
        value,
        followUp,
        callbackFunction,
    };
};

export { Question, Answer };