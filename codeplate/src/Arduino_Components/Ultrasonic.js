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
                                    questionText="What kind of values should come out of the ultrasonic sensor? By default, values range from 0 to 255, which will be converted to cm."
                                    answerType = {AnswerType.MULTI_OPTION} 
                                    answerOption = {
                                        [
                                            {
                                                text: "Turn the ultrasonic values into just two values, using a threshold. With one output state above the threshold.", 
                                                value: "binary",
                                                followup: <Question handleAnswer = {this.updateThreshold}
                                                                    questionText="What should the threshold be? The ultrasonic value is a number that represents the distance in cm."
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
            `// Declare variables for Ultrasonic Sensor ${this.props.id}`,
            `// Connect the trig pin of Ultrasonic Sensor ${this.props.id} to Digital 7`,
            this.state.code.strDefine(this.state._trig, 7), // temp
            `// Connect the echo pin of Ultrasonic Sensor ${this.props.id} to Digital 6`,
            this.state.code.strDefine(this.state._echo, 6), // temp

            `// Variable for the raw distance for Ultrasonic Sensor ${this.props.id}`,
            this.state.code.strInitVariable("int", this.state._distance, 0),

            `// Variable for collecting the measured length of sound wave for Ultrasonic Sensor ${this.props.id}, which will be converted to distance`,
            this.state.code.strInitVariable("int", this.state._duration, 0),
        ];
        if (this.state.mode == "binary") {
            codeBlock.push(...[`// Instantiate the boundary for Ultrasonic Sensor ${this.props.id}`, this.state.code.strInitVariable("int", this.state._boundary, threshold)]);
        } 
        return codeBlock;
    }

    getSetup = () => {
        return [`// Start reading in values for Ultrasonic Sensor ${this.props.id}`, `pinMode(${this.state._trig}, OUTPUT);`, `pinMode(${this.state._echo}, INPUT);`];
    }

    getLoopStart = () => {
        console.log(this.props.isSerial)
        var ret = [
            `// Read in the measured distance for Ultrasonic Sensor ${this.props.id}`,
            `digitalWrite(${this.state._trig}, LOW);`, `delayMicroseconds(2);`, 
            `digitalWrite(${this.state._trig}, HIGH);`, `delayMicroseconds(10);`, 
            `digitalWrite(${this.state._trig}, LOW);`, 
            `${this.state._duration} = pulseIn(${this.state._echo}, HIGH);`,
            
            `//Convert the measured duration to centimeters`,
            `${this.state._distance} = ${this.state._duration} * 0.034 / 2;`]
        if (this.props.isSerial) {
            ret.push(
                `// Print values to Serial monitor for Ultrasonic Sensor ${this.props.id}`, `Serial.print("Duration: ");`, `Serial.println(${this.state._duration});`, `Serial.print(\"Distance: \");`, `Serial.println(${this.state._distance});`);
        }
        return ret
    }

    getLoopLogic = () => {
        var code = [];
        if (this.state.mode == "binary") {
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
