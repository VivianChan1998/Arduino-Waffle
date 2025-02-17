import React from 'react';
import LED from './Arduino_Components/LED';
import Button from './Arduino_Components/Button';
import { STAGE } from './Arduino_Components/Tools/Enums';


export default class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            stage: STAGE.CHOOSE_COMPONENT,
            availableInputComponents: ["button"],
            availableOutputComponents: ['LED'],
            chosenInputComponentsNames: [],
            chosenInputComponents: [],
            chosenOutputComponentsNames: [],
            chosenOutputComponents: [], 
            inputProps: [],
            outputProps: [],
            ioPairingId: 0,
            ioPairs: [[], []], //temp
            codeGlobal: [],
            codeSetup: [],
            codeLoop: [],
            codeHelperFunction: []
        }
    }
    handleChoseInputComponent = (component, cname) => {
        var arr = this.state.inputProps
        arr.push(new Array())
        this.setState  ({
            chosenInputComponents: this.state.chosenInputComponents.concat([component]), 
            chosenInputComponentsNames: this.state.chosenInputComponentsNames.concat([cname]),
            inputProps: arr
        }) 
    }
    handleChoseOutputComponent = (component, cname) => {
        var arr = this.state.outputProps
        arr.push(new Array())
        this.setState  ({
            chosenOutputComponents: this.state.chosenOutputComponents.concat([component]),
            chosenOutputComponentsNames: this.state.chosenOutputComponentsNames.concat([cname]),
            outputProps: arr
        }) 
    }
    handlePropsChange = (p, id, io) => {
        console.log(this.state.outputProps)
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
    handleCode = (global, setup, looplogic, helper) => {
        console.log("IN HANDLE CODE")
        //this.props.handleCode(this.getGlobalVar(), this.getSetup(), this.getLoopLogic(), this.getHelperFunction());
    }
    render() {
        if (this.state.stage === STAGE.CHOOSE_COMPONENT) {
            return (
                <div>
                    <ChooseComponent availableInputComponents={this.state.availableInputComponents}
                                    availableOutputComponents={this.state.availableOutputComponents}
                                    handleChoseInputComponent={this.handleChoseInputComponent}
                                    handleChoseOutputComponent={this.handleChoseOutputComponent}
                                    handlePropsChange={this.handlePropsChange}
                                    getStage={this.getStage}
                                    handleCode={this.handleCode}
                                    />
                    <button onClick = {() => this.setState({stage: STAGE.INIT_QUESTION})}> next </button>
                </div>
            )
        }
        else if (this.state.stage === STAGE.INIT_QUESTION) {
            return (
                <div>
                    init questions
                    <div>
                        {this.state.chosenOutputComponents.map(el => el)}
                    </div>
                    <button onClick = {() => this.setState({stage: STAGE.IO_PAIRING})}> next </button>
                </div>
            );
        }
        else if (this.state.stage === STAGE.IO_PAIRING) {
            return (
                <div>
                    i/o pairing
                    <div>
                        for the {this.state.chosenInputComponentsNames[this.state.ioPairingId]} component:
                        {
                            this.state.chosenInputComponents[this.state.ioPairingId]
                        }
                        
                        which output component would you like to pair it with?
                        {
                            this.state.chosenOutputComponents.map((el, index) => {
                                return <button key={index} onClick={() => {
                                    var temp = this.state.ioPairs
                                    temp[this.state.ioPairingId] = temp[this.state.ioPairingId].concat([index])
                                    this.setState({
                                        ioPairs: temp
                                    })
                                }}> {this.state.chosenOutputComponentsNames[this.state.ioPairingId]} </button>
                            })
                        }
                    </div>
                    {
                        this.state.ioPairingId < this.state.chosenInputComponents.length - 1 ?
                        <button onClick = {() => this.setState({ioPairingId: this.state.ioPairingId + 1})}> next </button> :
                        <button onClick = {() => {
                            this.setState({stage: STAGE.DEFINE_BEHAVIOR})
                            this.setState({ioPairingId: 0})
                        }}> next </button>
                    }
                </div>
            );
        }
        else if (this.state.stage === STAGE.DEFINE_BEHAVIOR) {
            return (
                <div>
                    define behavior
                    <br/>
                    The {this.state.chosenInputComponentsNames[this.state.ioPairingId]} component: {/*TODO write the sentence in a better way*/}
                    <br/>
                    {
                        
                        this.state.ioPairs[this.state.ioPairingId].map((idx, index) => 
                            <>
                                for the {this.state.chosenOutputComponentsNames[idx]} component:
                                <br/>
                                {this.state.chosenOutputComponents[idx]}
                            </>
                        
                        )
                    }
                    {
                        this.state.ioPairingId < this.state.chosenInputComponents.length - 1 ?
                        <button onClick = {() => {this.setState({ioPairingId: this.state.ioPairingId + 1})}}> next </button> :
                        <button onClick = {() => this.setState({stage: STAGE.RENDER_CODE})}> next </button>
                    }
                </div>
            )
        }
        else if (this.state.stage === STAGE.RENDER_CODE) {
            return (
                <div>
                    render code
                    {this.state.chosenOutputComponents.map(el => el)}
                    {this.state.chosenInputComponents.map(el => el)}
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
                /*TODO : add more objects */
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
            case 'button':
                obj = <Button handlePropsChange={this.props.handlePropsChange} id={this.state.chosenInput.length} getStage={this.props.getStage}/>
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

                <h2>Chosen Input Components</h2>
                {
                    this.state.chosenInput.map( (name, idx) => <p key={idx}> {name} </p>)
                }
                <div>
                    {
                        this.props.availableInputComponents.map((el, index) => {
                            return <button key={index} onClick={ () => this.handleChoseInput(el)} > {el} </button>
                        })
                    }
                </div>

                <h2>Chosen Output Components</h2>
                {
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