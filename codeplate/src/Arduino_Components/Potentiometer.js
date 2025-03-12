import React from "react";
import Component from "./Tools/Components.js";
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
                                    questionText="What kind of values should come out of the potentiometer?  By default, values range from 0 to 1023."
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [   
                                            {
                                                text: "Turn the potentiometer values into just two values, using a threshold.  I want one output state under the threshold, one output state over the threshold.", 
                                                value: "binary",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText = "What should the threshold be? The potentiometer values range from 0 to 1023."
                                                                    answerType = {AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Pass along the full range of values. I'll use some rules to convert the range of values into the outputs I want.", 
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
            code: new Code()
        }
    }


    updateInit = (answer, hasFollowup, followUp) => {
        if(answer==="analog"){
            console.log("analog input")
            this.props.setAnalog(this.props.id, this.state._val, this.state._analog_max)
        }
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            setup: [], // Assuming setup is an empty array
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(answer),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });
        
    }

    updateThreshold = (answer) => {
        this.setState({threshold: answer})
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(0),
            setup: [], // Assuming setup is an empty array
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(this.state.mode),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });
    }
    
    updateAnalog = (answer) => {
        this.setState({analog: answer})
        this.props.handlePropsChange({analog: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(answer),
            setup: [], // Assuming setup is an empty array
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(this.state.mode),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });        
    }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "INPUT")
    }

    getName = () => { return "Potentiometer" }

    getGlobalVar = (a) => {
        let codeBlock = [
            this.state.code.strDefine(this.state._pin, 7),
            this.state.code.strInitVariable("int", this.state._val, 0),
        ];
        if (this.state._threshold) {
            codeBlock.push(this.state.code.strInitVariable("int", this.state._boundary, a));
        } 
        return codeBlock;
    }

    // no setup 

    getLoopStart = () => {
        return [`${this.state._val} = analogRead(${this.state._pin});`, `Serial.println(${this.state._val});`]; 
    }

    getLoopLogic = (mode) => {
        let code = []
        if (mode == "binary") {
            code = [`${this.state._val} > ${this.state._boundary}`]; 
        }
        return code;
    }

    getAnalogInput = () => {
        return this.state._val
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