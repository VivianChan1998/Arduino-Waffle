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
                                    questionText="What kind of values should come out of the ultrasonic sensor? By default, values range from 0 to 255."
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [
                                            {
                                                text: "Turn the ultrasonic values into just two values, using a threshold. With one output state above the threshold.", 
                                                value: "binary",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText="What should the threshold be? The ultrasonic value is an arbitrary number that represents the distance, from 0 (extremely close) to 255."
                                                                    answerType={AnswerType.NUMERICAL} />
                                            },
                                            {
                                                text: "Pass along the full range of values. I'll use some rules to convert the range of values into the outputs I want.",
                                                value: "analog",
                                                followup: "",
                                                //analog: <Question handleAnswer = {this.updateAnalog} />
                                            }
                                        ]
                                    }/>,
            _trig: `ultrasonicTrig_${props.id}_pin`,
            _echo: `ultrasonicEcho_${props.id}_pin`,
            _boundary: `ultrasonicThreshold_${props.id}`,
            _duration: `ultrasonicDuration_${props.id}`,
            _distance:`ultrasonicDistance_${props.id}`,
            analog_max: 255,                
            code: new Code()                 
        }
    }

    updateInit = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if(answer==="analog"){
            console.log("analog input")
            this.props.setAnalog(this.props.id, this.state._distance, this.state.analog_max)

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
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
        //this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")

    }

    updateThreshold = (answer) => {
        this.setState({threshold: answer})
        //this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode({
            io: "INPUT",
            id: this.props.id,
            global: this.getGlobalVar(answer),
            setup: this.getSetup(),
            loopstart: this.getLoopStart(),
            looplogic: this.getLoopLogic(),
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
            analogInputParam: this.getAnalogInput()
        });
        
    }

    getName = () => { return "Ultrasonic" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "INPUT")
    }

    getGlobalVar = (threshold) => {
        let codeBlock = [
            `// Declaring global variables for Ultrasonic Sensor ${props.id}`,
            `// Variables used to read distance for Ultrasonic Sensor ${props.id}`,
            this.state.code.strDefine(this.state._trig, 7), // temp
            this.state.code.strDefine(this.state._echo, 6), // temp

            `// Variables used to store the distance and duration of reading measurements for Ultrasonic Sensor ${props.id}`,
            this.state.code.strInitVariable("int", this.state._distance, 0),
            this.state.code.strInitVariable("int", this.state._duration, 7),
        ];
        if (this.state.mode == "binary") {
            `// User-selected threshold for Ultrasonic Sensor ${props.id}`,
            codeBlock.push(this.state.code.strInitVariable("int", this.state._boundary, threshold));
        } 
        return codeBlock;
    }

    getSetup = () => {
        return [
            `// Connect trig and echo pins for Ultrasonic Sensor ${props.id}`,
            `pinMode(${this.state._trig}, OUTPUT);`, 
            `pinMode(${this.state._echo}, INPUT);`];
    }

    getLoopStart = () => {
        console.log(this.props.isSerial)
        var ret = [
            `// Code to read in input data and convert measured data to centimeters for Ultrasonic Sensor ${props.id}`
            `digitalWrite(${this.state._trig}, LOW);`, `delayMicroseconds(2);`, 
            `digitalWrite(${this.state._trig}, HIGH);`, `delayMicroseconds(10);`, 
            `digitalWrite(${this.state._trig}, LOW);`, 
            `${this.state._duration} = pulseIn(${this.state._echo}, HIGH);`, 
            `${this.state._distance} = ${this.state._duration} * 0.034 / 2;`]
        if (this.props.isSerial) {
            `// Code to print relevant variables for Ultrasonic Sensor ${props.id} to Serial Monitor`,
            ret.push(`Serial.print("Duration: ");`, `Serial.println(${this.state._duration});`, `Serial.print(\"Distance: \");`, `Serial.println(${this.state._distance});`);
        }
        return ret
    }

    getLoopLogic = () => {
        var code = [];
        if (this.state.mode == "binary") {
            `// Code for binary input/output states`
            code.push(`${this.state._distance} > ${this.state._boundary}`); 
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
