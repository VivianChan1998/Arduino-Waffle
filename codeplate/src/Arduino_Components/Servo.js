import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class Servo extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.OUTPUT_DEVICE,
            initQuestion: <Question handleAnswer = {this.updateInit}
                                questionText="What do you want to use your Servo motor for?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "Shift the Servo motor prong to a fixed position.",
                                        value: "position",
                                        followup: <Question handleAnswer = {this.updatePosition}
                                                            questionText="What should the position of the Servo be? The expected range of values is 0 - 180."
                                                            answerType={AnswerType.NUMERICAL} />
                                    },
                                    {
                                        text: "Sweep the Servo prong 180 degrees.",
                                        value: "sweep",
                                        followup: <Question handleAnswer = {this.updatePwm}
                                                            questionText="What should the PWM (speed) of the Servo sweep be?"
                                                            answerType={AnswerType.NUMERICAL} />
                                    }
                                ]} />, 
            analogQuestion: <Question handleAnswer = {this.updateAnalog}
                                questionText="What do you want to use your Servo motor for (analog input dependent)?"
                                answerType={AnswerType.MULTI_OPTION}
                                answerOption={[
                                    {
                                        text: "Shift the Servo motor prong to a position dependent on the input component.",
                                        value: "position",
                                        
                                    },
                                    {
                                        text: "Sweep the Servo prong 180 degrees, with a pwm dependent on the input component.",
                                        value: "sweep",
                                    }
                                ]} />, 
            _servo: `servo_${props.id}`,
            _pos: `pos_${props.id}`,
            analogMax: 180,
            code: new Code()
        }
    }

    updateAnalog = (answer) => { // fix
        this.setState({init: answer})
    }

    updateInit = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({question: followUp})
        }
    }

    updatePosition = (answer) => {
        this.setState({position: answer})
    }

    updatePWM = (answer) => {
        this.setState({pwm: answer})
    }

    getName = () => { return "Servo" }

    handleAnswer = p => {
        this.props.handlePropsChange(p, this.props.id, "OUTPUT")
    }

    getGlobalVar = () => {
        let code = [`Servo ${this.state._servo}`];
        if (this.state.init == "sweep") {
            code.push(`int ${this.state._pos} = 0`);
        }
        return code;
    }

    getSetup = () => {
        return [`${this.state._servo}.attach(6);`];
    }

    /* TODO
    getLoopLogicAnalog = () => {

    }
    */

    /* TODO

    getLoopLogicAnalog(stateNum, param, paramMax, reverse = false) {
        let brightness = `int(${this.analogMax} / ${paramMax} * ${param})`;
        if (reverse) {
            brightness = `${this.analogMax} - ${brightness}`;
        }
        const color = this.states[stateNum]["color"];
        return [
            `${this._objName}.setBrightness(${brightness});`,
            `colorWipe(${this._objName}.Color(${color[0]}${color[1]}, ${color[2]}${color[3]}, ${color[4]}${color[5]}), 50);`
        ];
    }

    */
    render() {
        console.log(this.state.mode)
        if (this.props.getStage() == STAGE.INIT_QUESTION) {
            return (
                <div>
                    {this.state.initQuestion}
                    <button onClick={() => {
                        var p = {
                            init: this.state.init
                        }
                        this.handleAnswer(p)
                    }} className="question-confirm-button">ok!</button>
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
                        mode: this.state.mode,
                        color: this.state.color
                    }
                    this.handleAnswer(p)
                    this.props.handleCode(this.getGlobalVar(), this.getSetup(), this.getLoopLogic(), this.getHelperFunction())
            }} className="question-confirm-button">ok!</button>
            </div>
        );
    }
}

export default Servo;
