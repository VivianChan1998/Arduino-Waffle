import React from "react";

export default class Component extends React.Component {
    constructor(id) {
        super()
        this.state = {
            id: id,
            parameter: {},
            question: null,
            init_question: null,
            pin_spec: null,
            library: null,
            states: [],
            init: {},
            isAnalog: false,
            analogMax: -1
        }
    }

    getInclude = () => {
        return this.state.library ? this.strInclude(this.state.library) : "";
    }

    getGlobalVar = () => { return ""; }

    getSetup = () => { return ""; }

    getLoopStart() { return ""; }
    
    getLoopLogic(stateNum = 0) { return ""; }

    getLoopEnd() { return "";}

    chooseState(stateNum) {
        this.state = this.stateNames[parseInt(stateNum)];
    }
    
    getHelperFunction() {
        return "";
    }

    strInclude(name) {
        return `#include <${name}>`;
    }

    strPinMode(name, io) {
        return `pinMode(${name}, ${io === 'i' ? "INPUT" : "OUTPUT"})`;
    }

    strDefine(variable, value) {
        return `#define ${variable} ${value}`;
    }

    strInitVariable(varType, variable, value) {
        return `${varType} ${variable} = ${value}`;
    }

    strAssignVariable(left, right) {
        return `${left} = ${right}`;
    }

    strCallFunction(obj, funcName, listToPass) {
        return `${obj}.${funcName}(${listToPass.join(', ')})`;
    }

    askInitQuestion() {
        if (this.init_question) {
            this.init_question.ask();
        }
    }

    askQuestion() {
        if (!this.question) {
            return -1;
        }
        if (this.isAnalog) {
            this.questionAnalog.ask();
        } else {
            this.question.ask();
        }
        this.states.push({ ...this.parameter });
        return this.states.length - 1;
    }

    setAnalog() {
        this.isAnalog = true;
    }

    get(key) {
        return this[key];
    }

    set(key, value) {
        this[key] = value;
    }

    render() {
        return (
            <div>
                <h2>{this.name}</h2>
            </div>
        );
    }
}
