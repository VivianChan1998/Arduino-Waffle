import React from 'react';
import LED from './Arduino_Components/LED';
import Button from './Arduino_Components/Button';
import Ultrasonic from './Arduino_Components/Ultrasonic';
import Servo from './Arduino_Components/Servo'
import Potentiometer from './Arduino_Components/Potentiometer';
import { STAGE } from './Arduino_Components/Tools/Enums';
import './index.css'
import { formProgram } from './Utils';

export default class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            stage: STAGE.CHOOSE_COMPONENT,
            availableInputComponents: ["Button", "Ultrasonic", "Potentiometer"],
            availableOutputComponents: ["LED", "Servo"],
            chosenInputComponentsNames: [],
            chosenInputComponents: [],
            chosenOutputComponentsNames: [],
            chosenOutputComponents: [], 
            inputProps: [],
            outputProps: [],
            ioPairingId: 0,
            ioPairs: [],
            codeInput: [],
            codeOutput: []
        }
    }
    handleChoseInputComponent = (component, cname) => {
        var arr = this.state.inputProps
        arr.push(new Array())
        var code_arr = this.state.codeInput
        code_arr.push({}) 
        var io_arr = this.state.ioPairs
        io_arr.push([])
        this.setState  ({
            chosenInputComponents: this.state.chosenInputComponents.concat([component]), 
            chosenInputComponentsNames: this.state.chosenInputComponentsNames.concat([cname]),
            inputProps: arr,
            cadeInput: code_arr,
            ioPairs: io_arr
        }) 
    }
    handleChoseOutputComponent = (component, cname) => {
        var arr = this.state.outputProps
        arr.push(new Array())
        var code_arr = this.state.codeOutput
        code_arr.push({}) 
        this.setState  ({
            chosenOutputComponents: this.state.chosenOutputComponents.concat([component]),
            chosenOutputComponentsNames: this.state.chosenOutputComponentsNames.concat([cname]),
            outputProps: arr,
            codeOutput: code_arr
        }) 
    }
    handlePropsChange = (p, id, io) => {
        if (io == 'INPUT') {
            var inputProps = this.state.inputProps
            inputProps[id] = {...inputProps[id], ...p}
            this.setState  ({
                inputProps: inputProps
            })
        }
        else {
            var outputProps = this.state.outputProps
            outputProps[id] = {...outputProps[id], ...p}
            this.setState  ({
                outputProps: outputProps
            })

        }
    }
    getStage = () => {
        return this.state.stage
    }
    handleCode = (io, id, global, setup, loopstart, looplogic, helper) => {
        if (io === "INPUT") {
            console.log(looplogic)
            var code_temp = this.state.codeInput
            code_temp[id] = {
                codeGlobal: global,
                codeSetup: setup,
                codeLoopStart: loopstart,
                codeLoop: looplogic,
                codeHelperFunction: helper
            }
            this.setState({codeInput: code_temp})
        }
        else{
            var code_temp = this.state.codeOutput
            code_temp[id] = {
                codeGlobal: global,
                codeSetup: setup,
                codeLoopStart: loopstart,
                codeLoop: looplogic,
                codeHelperFunction: helper
            }
            this.setState({codeOutput: code_temp})
        }

        
    }
    render() {
        if (this.state.stage === STAGE.CHOOSE_COMPONENT) {
            return (
                <div className="main-wrapper">
                    <h2>Chose components to include</h2>
                    <ChooseComponent availableInputComponents={this.state.availableInputComponents}
                                    availableOutputComponents={this.state.availableOutputComponents}
                                    handleChoseInputComponent={this.handleChoseInputComponent}
                                    handleChoseOutputComponent={this.handleChoseOutputComponent}
                                    handlePropsChange={this.handlePropsChange}
                                    getStage={this.getStage}
                                    handleCode={this.handleCode}
                                    />
                    <button className='next-step-button' onClick = {() => this.setState({stage: STAGE.INIT_QUESTION})}> next </button>
                </div>
            )
        }
        else if (this.state.stage === STAGE.INIT_QUESTION) {
            return (
                <div className="main-wrapper">
                    <h2>Initializing components</h2>
                    <div>
                        {this.state.chosenOutputComponents.map(el => el)}
                    </div>
                    <button className='next-step-button' onClick = {() => this.setState({stage: STAGE.IO_PAIRING})}> next </button>
                </div>
            );
        }
        else if (this.state.stage === STAGE.IO_PAIRING) {
            return (
                <div className="main-wrapper">
                    <h2>Pairing inputs and outputs</h2>
                    <div>
                        <h3>For the {this.state.chosenInputComponentsNames[this.state.ioPairingId]} {[this.state.ioPairingId]} component:</h3>
                        {
                            this.state.chosenInputComponents[this.state.ioPairingId]
                        }
                        
                        <h3>Which output component would you like to pair it with?</h3>
                        {
                            this.state.ioPairs[this.state.ioPairingId].map((el,index) => <p>{this.state.chosenOutputComponentsNames[el]}{index}</p>)
                        }
                        <br/>
                        {
                            this.state.chosenOutputComponents.map((el, index) => {
                                return <button key={index} onClick={() => {
                                    var temp = this.state.ioPairs
                                    temp[this.state.ioPairingId] = temp[this.state.ioPairingId].concat([index])
                                    this.setState({
                                        ioPairs: temp
                                    })
                                }}> {this.state.chosenOutputComponentsNames[this.state.ioPairingId] + ' ' + index} </button>
                            }) /* TODO potential bug here?? */
                        }
                    </div>
                    {
                        this.state.ioPairingId < this.state.chosenInputComponents.length - 1 ?
                        <button onClick = {() => this.setState({ioPairingId: this.state.ioPairingId + 1})}> next </button> :
                        <button onClick = {() => {
                            this.setState({stage: STAGE.DEFINE_BEHAVIOR})
                            this.setState({ioPairingId: 0})
                        }} className='next-step-button'> next </button>
                    }
                </div>
            );
        }
        else if (this.state.stage === STAGE.DEFINE_BEHAVIOR) {
            return (
                <div className="main-wrapper">
                    <h2>Define behavior</h2>
                    <br/>
                    <h3>For the {this.state.chosenInputComponentsNames[this.state.ioPairingId] + ' ' + this.state.ioPairingId} component: </h3> {/*TODO write the sentence in a better way*/}
                    {
                        
                        this.state.ioPairs[this.state.ioPairingId].map((idx, index) => 
                            <>
                                <h4> Output {this.state.chosenOutputComponentsNames[idx] + index}: </h4>
                                {this.state.chosenOutputComponents[idx]}
                            </>
                        
                        )
                    }
                    {
                        this.state.ioPairingId < this.state.chosenInputComponents.length - 1 ?
                        <button className='next-step-button' onClick = {() => {this.setState({ioPairingId: this.state.ioPairingId + 1})}}> next </button> :
                        <button className='next-step-button' onClick = {() => this.setState({stage: STAGE.RENDER_CODE})}> next </button>
                    }
                </div>
            )
        }
        else if (this.state.stage === STAGE.RENDER_CODE) {
            console.log(this.state.ioPairs)
            return (
                <div className="main-wrapper">
                    <h2>Render code</h2>
                    <br/>

                    <code>
                        {/* GLOBAL */}
                        {
                            this.state.codeInput.map(el =>{
                                return <pre>{formProgram(el.codeGlobal, 0)}</pre>
                            }
                            )
                        }
                        {
                            this.state.codeOutput.map(el =>{
                                return <pre>{formProgram(el.codeGlobal, 0)}</pre>
                            }
                            )
                        }

                        {/* SETUP */}

                        <> void setup{'() {'}</>
                        <br/>
                        {
                            this.state.codeInput.map(el =>{
                                return <pre>{formProgram(el.codeSetup, 1)}</pre>
                            }
                            )
                        }
                        {
                            this.state.codeOutput.map(el =>{
                                return <pre>{formProgram(el.codeSetup, 1)}</pre>
                                }
                            )
                        }
                        <>{'}'}</>
                        <br/>

                        {/* LOOP */}
                        
                        <> void loop{'() {\n\n'}</>
                        <br/>
                        {
                            this.state.codeInput.map(el =>{
                                return <pre>{formProgram(el.codeLoopStart, 1)}</pre>}
                            )
                        }
                        {
                            this.state.codeOutput.map(el =>{
                                return <pre>{formProgram(el.codeLoopStart, 1)}</pre>}
                            )
                        }
                        {
                            this.state.ioPairs.map((output_list, index) => {
                                var ret = ["if (" + this.state.codeInput[index].codeLoop + ") {"]
                                for(var i=0; i<output_list.length; i++) {
                                    var output_idx = output_list[i]
                                    console.log(output_idx)
                                    console.log(this.state.codeOutput[output_idx])
                                    ret.push(this.state.codeOutput[output_idx].codeLoop)
                                }
                                ret.push("}")
                                console.log(ret)
                                return <pre>{formProgram(ret, 1)}</pre>
                            })
                        }

                        <>{'}'}</>
                        <br/>
                        <br/>

                        //helper function

                        <br/>

                        {
                            this.state.codeInput.map(el =>{
                                return <pre>{formProgram(el.codeHelperFunction, 0)}</pre>
                            })
                        }
                        {
                            this.state.codeOutput.map(el =>{
                                return <pre>{formProgram(el.codeHelperFunction, 0)}</pre>
                            })
                        }

                    </code>

                    
                </div>
            )
        }
    }
}

class ChooseComponent extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            chosenOutput: [],
            chosenInput: []
        }
    }
    handleChoseOutput = (el) => {
        this.setState({
            chosenOutput: this.state.chosenOutput.concat([el])
        })
        var obj = null
        switch (el) {
            case 'LED':
                obj = <LED handlePropsChange={this.props.handlePropsChange}
                        id={this.state.chosenOutput.length}
                        getStage={this.props.getStage}
                        handleCode={this.props.handleCode}
                        />
                break;
            case 'Servo':
                obj = <Servo handlePropsChange={this.props.handlePropsChange}
                        id={this.state.chosenOutput.length}
                        getStage={this.props.getStage}
                        handleCode={this.props.handleCode}
                        />
                break;
            default:
                console.log("error")
        }
        this.props.handleChoseOutputComponent(obj, el)
    }

    handleChoseInput = (el) => {
        this.setState({
            chosenInput: this.state.chosenInput.concat([el])
        })
        var obj = null
        switch (el) {
            case 'Button':
                obj = <Button handlePropsChange={this.props.handlePropsChange}
                                id={this.state.chosenInput.length}
                                getStage={this.props.getStage}
                                handleCode={this.props.handleCode}
                                />
                break;
            case 'Ultrasonic':
                obj = <Ultrasonic handlePropsChange={this.props.handlePropsChange}
                                id={this.state.chosenInput.length}
                                getStage={this.props.getStage}
                                handleCode={this.props.handleCode}
                                />
                break;
            case 'Potentiometer':
                obj = <Potentiometer handlePropsChange={this.props.handlePropsChange}
                                id={this.state.chosenInput.length}
                                getStage={this.props.getStage}
                                handleCode={this.props.handleCode}
                                />
                break;
                /*TODO : add more objects */
            default:
                console.log("error")
        }
        this.props.handleChoseInputComponent(obj, el)
    }
    render() {
        return (
            <div>

                <h3>Chose Input Components</h3>
                {
                    this.state.chosenInput.length == 0?
                    <p>click on buttons to add components.</p> :
                    this.state.chosenInput.map( (name, idx) => <p key={idx}> {name} </p>)
                }
                <div>
                    {
                        this.props.availableInputComponents.map((el, index) => {
                            return <button key={index} onClick={ () => this.handleChoseInput(el)} > {el} </button>
                        })
                    }
                </div>

                <h3>Chose Output Components</h3>
                {
                    this.state.chosenOutput.length == 0?
                    <p>click on buttons to add components.</p> :
                    this.state.chosenOutput.map( (name, idx) => <p key={idx}> {name} </p>)
                }
                <div>
                    {
                        this.props.availableOutputComponents.map((el, index) => {
                            return <button key={index} onClick={ () => this.handleChoseOutput(el)} > {el} </button>
                        })
                    }
                </div>
            </div>
        );
    }
}