import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from './Tools/Code.js'

class Potentiometer extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE,
            init: 0,
            initQuestion: <Question handleAnswer={this.updateInit}
                                    questionText= {`What do you what to use Potentiometer ${props.id} for?`}
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [   
                                            {
                                                text: "Binary threshold with respect to an output component, one output state under threshold, one output state over threshold.", 
                                                value: "binary",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText = "What should the binary threshold be? The max value a potentiometer can read is 1023."
                                                                    answerType = {AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Use analog input for determining the output component behavior, each different analog value will directly impact state through conversion of the input values.", 
                                                value: "analog",
                                                followup: "",
                                                analog: <Question handleAnswer = {this.updateAnalog} />
                                            }
                                        ]
                                    }/>,
            _pin: `potentiometerPin_${props.id}`,
            _val: `potentiometerVal_${props.id}`,
            _boundary:  `potentiometer_I/O_Boundary_${props.id}`,
            _analog_max: 1023,
            _analog_param_name: this.state._val,
            code: new Code(),
            mode: '',
            threshold: '',
        }
    }


    updateInit = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
        console.log(hasFollowup)
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode("INPUT", this.props.id, this.getGlobalVar(), [], this.getLoopStart(), this.getLoopLogic(answer), [])
    }

    updateThreshold = (answer) => {
        this.setState({threshold: answer})
        this.props.handlePropsChange({threshold: answer}, this.props.id, "INPUT")
        this.props.handleCode("INPUT", this.props.id, this.getGlobalVar(answer), [], this.getLoopStart(), this.getLoopLogic(), [])
    }

    updateAnalog = (answer) => {
        this.setState({analog: answer})
        this.props.handlePropsChange({analog: answer}, this.props.id, "INPUT")
        this.props.handleCode("INPUT", this.props.id, this.getGlobalVar(answer), [], this.getLoopStart(), this.getLoopLogic(this.state.mode), [])
    }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "INPUT")
    }

    getName = () => { return "Potentiometer" }

    getGlobalVar = (threshold) => {
        let codeBlock = [
            `// Defines global variables for Potentiometer ${props.id}`, 
            this.state.code.strDefine(this.state._pin, 7),
            this.state.code.strInitVariable("int", this.state._val, 6),
        ];
        if (threshold) {
            codeBlock.push(this.state.code.strInitVariable("int", this.state._boundary, a));
        } 
        return codeBlock;
    }

    // no setup 

    getLoopStart = () => {
        return [
            `// Reading and printing read values from Potentiometer ${props.id}`,
            `${this.state._val} = analogRead(${this.state._pin});`, 
            `Serial.println(${this.state._val});`]; 
    }

    getLoopLogic = (mode) => {
        let code = []
        if (mode == "binary") {
            code = [`// Threshold set for Potentiometer ${props.id}`, 
            `${this.state._val} > ${this.state._boundary}`]; 
        }
        return code;
    }
    

    render() {
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                </div>
            );
        }

        return (
            <div>
                {this.state.question}
            </div>
        );
    }
}

export default Potentiometer;