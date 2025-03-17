import React from "react";
import Component from "./Tools/Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class Stepper extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.OUTPUT_DEVICE,
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
                                questionText="What do you want to use your Stepper motor for (analog input dependent)?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "Shift the Stepper motor prong to a position dependent on the input component.",
                                        value: "position",
                                    },
                                    {
                                        text: "Sweep the Stepper prong 180 degrees, with a pwm dependent on the input component.",
                                        value: "sweep",
                                    }
                                ]} />,
            _objName: `stepper${props.id}`,
            _countName: `stepper${props.id}_count`,
            _sensorReadingName: `stepper${props.id}_sensorReading`,
            _pos: `pos_${props.id}`,
            analogMax: 255,
            code: new Code()
        }
    }

    updateAnalog = (answer) => { // fix 
        console.log("update analog")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            setup: this.getSetup(255),
            looplogic: this.getLoopLogic(1),
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
            setup: this.getSetup(answer),
            looplogic: this.getLoopLogic(1)
        });
        
    }

    getName = () => { return "Stepper" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar = () => {
        return [`#include <Stepper.h>`, `const int stepsPerRevolution = 200;`,
            `Stepper ${this.state._objName}(stepsPerRevolution, 8, 9, 10, 11);`,
            `int ${this.state._countName} = 0;`
        ];
    }
    getSetup = (pwm) => {
        return [`${this.state._objName}.setSpeed(${pwm});`,]
    }

    getLoopLogic = (steps) => {
        return [
            `${this.state._objName}.step(${steps});`
        ]
    }

    getLoopLogicAnalog = (answer) => {
        if (answer === "position") {
            return [
                `int pos = int( 200 / ${this.props.paramMax} * ${this.props.paramName});`,
                `if (${this.state._countName}%200 < pos ) {`,
                `${this.state._objName}.step(1);`,
                `${this.state._countName}++;`,
                `}`
            ]
        }
        else {
            return [
                `int speed = int( 255 / ${this.props.paramMax} * ${this.props.paramName});`,
                `${this.state._objName}.setSpeed(speed);`,
                `${this.state._objName}.step(1);`,
            ];
        }
    }
    
    render() {
        console.log(this.props.isAnalog)
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
