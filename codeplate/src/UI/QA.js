import React from "react";

class QA extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            question: props.question,
            answerType: props.answerType,
            answer: props.answer
        }
    }
    render() {
        return (
        <div>
            <h2>{this.props.question}</h2>
            <Answer answerType={this.props.answerType} answer={this.props.answer} />
        </div>
        );
    }
}

export default QA;

class Answer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            answerType: props.answerType,
            answer: props.answer
        }
    }
    render() {
        return (
        <div>
            
        </div>
        );
    }
}