import React from "react";
import Component from "./Tools/Components.js";
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
                                        followup: <Question handleAnswer = {this.updatePWM}
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
        this.props.handlePropsChange({init: answer}, this.props.id, "OUTPUT")
    }

    updateInit = (answer, hasFollowup, followUp) => {
        this.setState({mode: answer})
        if (hasFollowup) {
            this.setState({initQuestion: followUp})
        }
        this.props.handlePropsChange({mode: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            setup: this.getSetup(),
            loopstart: [], // Assuming loopstart is an empty array
            looplogic: this.getLoopLogic(answer, ''),
            helper: this.getHelperFunction(answer)
        });        
    }

    updatePosition = (answer) => {
        this.setState({position: answer})
        this.props.handlePropsChange({position: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            setup: this.getSetup(),
            loopstart: [], // Assuming loopstart is an empty array
            looplogic: this.getLoopLogic(answer, ''),
            helper: this.getHelperFunction(answer)
        });
        
    }

    updatePWM = (answer) => {
        this.setState({pwm: answer})
        this.props.handlePropsChange({pwm: answer}, this.props.id, "OUTPUT")
        this.props.handleCode({
            io: "OUTPUT",
            id: this.props.id,
            global: this.getGlobalVar(),
            setup: this.getSetup(),
            loopstart: [], // Assuming loopstart is an empty array
            looplogic: this.getLoopLogic(answer, ''),
            helper: this.getHelperFunction(answer)
        });
        
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
                </div>
            );
        }

        return (
            <div>
                <p>just press next :)</p>
            </div>
        );
    }
}

export default Servo;
