import React from "react";
import Component from "./Tools/Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class Stepper extends Component {
    constructor(props){
        super(props)
        console.log(props.id)
        this.state = {
            deviceType: ComponentType.OUTPUT_DEVICE,
            initQuestion: <Question handleAnswer = {this.updateSpeed}
                                    questionText="What should the speed of the stepper motor be? Ranging from 1 - 255 with 255 being the fastest. 255 as a default is recommended."
                                    answerType={AnswerType.NUMERICAL} />,

            digitalQuestion: <Question handleAnswer = {this.updateDigital}
                                questionText="What should the Stepper motor do when it is triggered?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "The Stepper motor prong should move a certain amount of steps",
                                        value: "position",
                                        followup: <Question handleAnswer = {this.updatePosition}
                                                            questionText="How many steps should the Stepper motor move? (200 steps makes a full rotation)"
                                                            answerType={AnswerType.NUMERICAL} />
                                    },
                                    {
                                        text: "The Stepper motor should start moving at a certain speed",
                                        value: "sweep",
                                        followup: <Question handleAnswer = {this.updatePWM}
                                                            questionText="What should the PWM (speed) of the Stepper sweep be?  Allowable speed values range from 0 to 255, from no movement to full speed."
                                                            answerType={AnswerType.NUMERICAL} />
                                    }
                                ]} />, 
            analogQuestion: <Question handleAnswer = {this.updateAnalog}
                                questionText="What do you want to use your Stepper motor for?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "Map the prong position to the input component.",
                                        value: "position"
                                    },
                                    {
                                        text: "The stepper motor move with the speed depending on the input component.",
                                        value: "speed"
                                    }
                                ]} />,
            _objName: `stepper${props.id}`,
            _countName: `stepper${props.id}_count`,
            _sensorReadingName: `stepper${props.id}_sensorReading`,
            _pos: `pos_${props.id}`,
            analogMax: 255,
            code: new Code(),
            speed: 255,
        }
    }

    updateSpeed = (answer) => {
        console.log("update speed")
        this.setState({speed: answer})
        //this.props.handlePropsChange({speed: answer}, this.props.id, "OUTPUT")
        this.setState({digitalMode: "analog"})
            this.props.handleCode({
                io: "OUTPUT",
                id: this.props.id,
                global: this.getGlobalVar(),
                setup: this.getSetup(answer),
                analogOutputFunction: this.getLoopLogicAnalog(answer)
            });
    }

    updateAnalog = (answer, hasFollowup, followUp) => {
        console.log("update analog")
        this.setState({digitalMode: "analog"})
            this.props.handleCode({
                io: "OUTPUT",
                id: this.props.id,
                global: this.getGlobalVar(),
                analogOutputFunction: this.getLoopLogicAnalog(answer)
            });
    }

    updateDigital = (answer, hasFollowup, followUp) => {
        console.log("update digital")
        this.setState({digitalMode: answer})
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
    }

    updatePosition = (answer) => {
        console.log("update position")
        this.setState({position: answer})
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            looplogic: this.getLoopLogic(answer)
        });
        
    }

    updatePWM = (answer) => {
        console.log("update pwm")
        this.setState({pwm: answer})
        this.props.handlePropsChange({pwm: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            //setup: this.getSetup(answer),
            looplogic: this.getLoopLogic(1)
        });
        
    }

    getName = () => { return "Stepper" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar = () => {
        return [
            `// Declare relevant libraries and global variables for Stepper ${this.props.id}`,
            `#include <Stepper.h>`, 
            `// Steppers default have a range of 200 steps for a full revolution`,
            `const int stepsPerRevolution = 200;`,
            `Stepper ${this.state._objName}(stepsPerRevolution, 8, 9, 10, 11);`,
            `int ${this.state._countName} = 0;`
        ];
    }
    getSetup = (pwm) => {
        return [`// Set Stepper ${this.props.id} to it's initial speed ${pwm}`, `${this.state._objName}.setSpeed(${pwm});`]
    }

    getLoopLogic = (steps) => {
        return [
            `// Step Stepper ${this.props.id} ${steps} times`,
            `${this.state._objName}.step(${steps});`
        ]
    }

    getLoopLogicAnalog = (answer) => {
        console.log(this.props.id)
        var id = this.props.id || 0
        if (answer === "position") {
            return [
                `// Map value read from input component for Stepper ${id} to a position, map(value, fromLow, fromHigh, toLow, toHigh)`, 
                `// pos represents the mapped position to move Stepper ${id} to 1023`,
                `int pos = map(potentiometerVal_0, 0, 1023, 0, 200);`,//int( 200 * ${this.props.paramName} / ${this.props.paramMax}.0);`,
                `if (${this.state._countName} < pos ) {`,
                `${this.state._objName}.step(1);`,
                `${this.state._countName}++;`,
                `}`,
                `else {`,
                `${this.state._objName}.step(-1);`,
                `${this.state._countName}--;`,
                `}`
            ]
        }
        else {
            return [
                `// Map value read from input component for Stepper ${id} to a speed, map(value, fromLow, fromHigh, toLow, toHigh)`,
                `// speed represents the mapped speed to set Stepper ${id} to 1023`,
                `int speed = map(potentiometerVal_0, 0, 1023, 0, 255);`,//int( 255 / ${this.props.paramMax} * ${this.props.paramName});`,
                `${this.state._objName}.setSpeed(speed);`,
                `${this.state._objName}.step(1);`,
            ];
        }
    }
    
    render() {
        console.log(this.props.isSerial)
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                </div>
            );
        }
        if (this.props.getStage() == STAGE.DEFINE_BEHAVIOR) {
            if(this.props.isAnalog) {
                return (
                    <div>
                        {this.state.analogQuestion}
                    </div>
                );
            }
            else {
                return (
                    <div>
                        {this.state.digitalQuestion}
                    </div>
                );
            }
            
        }

        return (
            <div>
            </div>
        );
    }
}

export default Stepper;
