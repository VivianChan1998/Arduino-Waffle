import React from "react";
import Component from "./Components.js";
import { ComponentType, AnswerType, STAGE } from "./Tools/Enums.js";
import { Question, Answer } from "./Tools/QA.js";
import Code from "./Tools/Code.js";

class Button extends Component {
    constructor(props){
        super(props)
        this.state = {
            deviceType: ComponentType.INPUT_DEVICE_ONLY_DIGITAL,
            init: 0,
            question: <Question handleAnswer = {this.updateAnswer}
                                    questionText = "When should the button trigger an output?"
                                    answerType = {AnswerType.MULTI_OPTION}
                                    answerOption = {
                                        [
                                            {
                                                text: "when the button is pressed briefly",
                                                value: "press",
                                                followup: ""
                                            },
                                            {
                                                text: "when the button is held down",
                                                value: "held",
                                                followup: ""
                                            },
                                            {
                                                text: "when the button is not being held down",
                                                value: "not",
                                                followup: ""
                                            }
                                        ]
                                    }
                                    />,
            _pin: "button" + props.id + "_pin",
            _val: "button" + props.id + "_val",
            _prev: "button" + props.id + "_prev",
            code: new Code()
        }
    }

    getName = () => { return "Button" }

    updateAnswer = (answer, option) => {
        this.setState({mode: answer})
        this.props.handlePropsChange({mode: answer}, this.props.id, "INPUT")
        this.props.handleCode("INPUT", this.props.id, this.getGlobalVar(answer), this.getSetup(), this.getLoopStart(answer), this.getLoopLogic(answer), this.getHelperFunction())
    }

    getGlobalVar = (mode) => {
        var ret = [this.state.code.strInitVariable("const int", this.state._pin, '2'), this.state.code.strInitVariable("int", this.state._val, '0')]
        if (mode === "press")
            ret.push(this.state.code.strInitVariable("int", this.state._prev, '0'))
        return ret
    }
    getSetup = () => {
        return [this.state.code.strPinMode(this.state._pin, 'o')]
    }
    getLoopStart = (mode) => {
        var ret = []
        if (mode == "press")
            ret.push(this.state.code.strAssignVariable(this.state._prev, this.state._val))
        ret.push(this.state.code.strAssignVariable(this.state._val, 'digitalRead(' + this.state._pin + ')'))
        return ret
    } //TODO
    getLoopLogic = (mode) => {
        var ret = []
        console.log(mode)
        switch (mode){
            case "press":
                ret.push(this.state._prev + " == 0 &&" + this.state._val + " == 1")
            case "held":
                ret.push(this.state._val + " == 1")
            case "not":
                ret.push(this.state._val + " == 0")
        }
        return ret
    }
    getHelperFunction = () => {
        return []
    }

    render() {
        if (this.props.getStage() === STAGE.RENDER_CODE) {
            return (
                <>
                </>
            )
        }
        return (
            <div>
                {this.state.question}
            </div>
        );
    }
}

export default Button;
