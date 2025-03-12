import React from "react";
import Component from "./Tools/Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from './Tools/Code.js'

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
                                            {
                                                text: "Binary threshold with respect to an output device, one output state under threshold, one output state over threshold.", 
                                                value: "binary threshold",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText="What threshold value do you want in centimeters?"
                                                                    answerType={AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Use analog input for determining for the output, each different analog value will differently impact state.",
                                                value: "analog direct",
                                                followup: "",
                                                analog: <Question handleAnswer = {this.updateAnalog} />
                                            }
                                        ]
                                    }/>,
            _trig: `ultrasonicTrig_${props.id}_pin`,
            _echo: `ultrasonicEcho_${props.id}_pin`,
            _boundary: `ultrasonic_I/O_Boundary_${props.id}`,
            _duration: `ultrasonicDuration_${props.id}`,
            _distance:`ultrasonicDistance_${props.id}`,
            analog_max: 1023,
            analog_param_name: this.state._distance, // is analog max the same for distance? need to check on the same                 
            code: new Code()                 
        }
    }

    updateInit = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(0),
            setup: this.getSetup(),
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });
        
    }

    updateThreshold = (answer) => {
        this.setState({threshold: answer})
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(answer),
            setup: this.getSetup(),
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });
        
    }

    updateAnalog = (answer) => {
        this.setState({analog: Boolean(true)})
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(this.state.threshold),
            setup: this.getSetup(),
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(),
            analogInputParam: this.getAnalogInput() // Fixed incorrect assignment syntax
        });
        
    }

    getName = () => { return "Ultrasonic" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "INPUT")
    }

    getGlobalVar = (threshold) => {
        let codeBlock = [
            this.state.code.strDefine(this.state._trig, 7), // temp
            this.state.code.strDefine(this.state._echo, 6) // temp
        ];
        if (this.state.mode == "binary threshold") {
            codeBlock.push(this.state.code.strInitVariable("int", this.state._boundary, threshold));
        } 
        return codeBlock;
    }

    getSetup = () => {
        return [`pinMode(${this.state._trig}, OUTPUT);`, `pinMode(${this.state._echo}, INPUT);`];
    }

    getLoopStart = () => {
        return [`digitalWrite(${this.state._trig}, LOW);`, `delayMicroseconds(2);`, 
            `digitalWrite(${this.state._trig}, HIGH);`, `delayMicroseconds(10);`, 
            `digitalWrite(${this.state._trig}, LOW);`, 
            `${this.state._duration} = pulseIn(${this.state._echo}, HIGH);`, 
            `${this.state._distance} = ${this.state._duration} * 0.034 / 2;`, 
            `Serial.print(\"Distance: \");`, `Serial.println(${this.state._distance});`];
    }

    getLoopLogic = () => {
        let code;
        if (this.state.mode == "binary threshold") {
            code = `${this.state._distance} > ${this.state._boundary}`; 
        } else if (this.state.mode == "analog direct") {
            code = ``;
        } 
        return code;
    }

    getAnalogInput = () => {
        return this.state._distance
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

export default Ultrasonic;
