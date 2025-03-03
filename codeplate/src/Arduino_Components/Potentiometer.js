import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, PinType } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";

class Potentiometer extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE,
            init: 0,
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText="What do you what to use this potentiometer for?"
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [   
                                            {
                                                text: "Binary threshold with respect to an output device, one output state under threshold, one output state over threshold.", 
                                                value: "binary threshold",
                                                followup: <Question handelAnswer = {this.updateThreshold}
                                                                    questionText = "WhatWhat should the binary threshold be? The max value a potentiometer can read is 1023."
                                                                    asnwerType = {AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Use analog input for determining the output behavior, each different analog value will directly impact state through conversion of the input values.", 
                                                value: "analog direct",
                                                followup: "",
                                                analog: <Question handleAnswer = {this.updateAnalog} />
                                            }
                                        ]
                                    }/>,
            _pin: `potentiometerPin_${props.id}`,
            _val: `potentiometerVal_ ${props.id}`,
            _boundary:  `potentiometer_I/O_Boundary_${props.id}`,
            _analog_max: 1023,
            _analog_param_name: this.state._val
                    
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
        this.setState({analog: Boolean(true)})
    }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "INPUT")
    }

    getName = () => { return "Potentiometer" }

    getGlobalVar = () => {
        let codeBlock = [
            this.state.code.strDefine(this.state._pin, 7), // temp
            this.state.code.strInitVariable(this.state._val, 6), // temp
        ];
        if (this.state._threshold) {
            codeBlock.push(this.state.code.strInitVariable("int", this.state._boundary, this.state._threshold));
        } 
        return codeBlock;
    }

    getLoopStart = () => {
        return [`${this.state._val} = analogRead(${this.state._pin})`, `Serial.println(${this.state._val})`]; 
    }

    getLoopLogic = () => {
        if (this.state._init == "binary threshold") {
            let code = `${this.state._val} > ${this.state._boundary}`; 
        } else if (this.state._init == "analog direct") {
            let code = ``;
        } 
        return code;
    }
    

    render() {
        console.log(this.state.mode)
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                    {this.state.init}
                    <button onClick={() => {
                        var p = {
                            init: this.state.init
                        }
                        this.handleAnswer(p)
                    }}>ok!</button>
                </div>
            );
        }
        
        if (this.props.getStage() == STAGE.RENDER_CODE) {
            
            return (
                <>
                </>
            );
        }

        return (
            <div>
                {this.state.question}
                <button onClick={() => {
                    var p = {
                        threshold: this.state.threshold,
                        analog: this.state.analog
                    }
                    this.handleAnswer(p)
                    this.props.handleCode("INPUT", this.state.id, this.getGlobalVar(), this.getLoopStart(), this.getLoopLogic())
            }}>ok!</button>
            </div>
        );
    }
}

export default Potentiometer;