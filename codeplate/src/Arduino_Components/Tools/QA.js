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
            <div id="question-wrapper">
                <p>{this.props.questionText}</p>
                {
                    this.props.answerType === AnswerType.BOOL ?
                        <>
                            <label>
                                <input type= "radio" id = "1" value= "true" onChange={e => this.props.handleAnswer(e.target.value)} />
                                <label for= "boolChoice1"> True </label>
                            </label>
                            <label>
                                <input type= "radio" id = "0" value= "false" onChange={e => this.props.handleAnswer(e.target.value)} />
                                <label form= "boolChoice2"> False </label>
                            </label>
                        </> : ""
                }
                {
                    this.props.answerType === AnswerType.NUMERICAL ?
                        <input type="text" onChange={e => this.props.handleAnswer(e.target.value)} /> : ""
                }
                {
                    this.props.answerType === AnswerType.MULTI_OPTION ?
                    this.props.answerOption.map((option, index) => (
                        <label key={index} className="question-options">
                            <input 
                                type="radio" 
                                id = {index}
                                value={option.value} 
                                onChange={e => this.props.handleAnswer(e.target.value, option.followup !== "", option.followup)} 
                            /> 
                            <label form= {index}> {option.text} </label>
                        </label>
                    )) //TODO: assure only one option can appear as chosen at one time
                    : "" 
                }
                {
                    this.props.answerType === AnswerType.TEXT ?
                        <input type="text" onChange={e => this.props.handleAnswer(e.target.value)} /> : ""
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