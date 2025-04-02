import React from 'react';
import LED from './Arduino_Components/LED';
import Button from './Arduino_Components/Button';
import Ultrasonic from './Arduino_Components/Ultrasonic';
import Stepper from './Arduino_Components/Stepper'
import Potentiometer from './Arduino_Components/Potentiometer';
import { STAGE } from './Arduino_Components/Tools/Enums';
import './index.css'
import { formProgram } from './Utils';
import Serial from './Arduino_Components/Serial';

export default class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            stage: STAGE.CHOOSE_COMPONENT,
            availableInputComponents: ["Button", "Ultrasonic", "Potentiometer"],
            availableOutputComponents: ["LED", "Stepper Motor"],
            chosenInputComponentsNames: [],
            chosenInputComponents: [],
            chosenOutputComponentsNames: [],
            chosenOutputComponents: [], 
            inputProps: [],
            outputProps: [],
            ioPairingId: 0,
            ioPairs: [],
            outputIsPaired: [],
            codeInput: [],
            codeOutput: [],
            isAnalogInput: [],
            isSerial: false
        }
        this.textContainerRef = React.createRef();
    }
    handleChoseInputComponent = (component, cname) => {
        var arr = this.state.inputProps
        arr.push(new Array())
        var code_arr = this.state.codeInput
        code_arr.push({}) 
        var io_arr = this.state.ioPairs
        io_arr.push([])
        var isAnalog = this.state.isAnalogInput
        isAnalog.push(0)
        var isPaired = this.state.outputIsPaired
        isPaired.push(0)
        var id = this.state.chosenInputComponents.length

        this.setState  ({
            chosenInputComponents: this.state.chosenInputComponents.concat([component]), 
            chosenInputComponentsNames: this.state.chosenInputComponentsNames.concat([`${cname}${id}`]),
            inputProps: arr,
            cadeInput: code_arr,
            ioPairs: io_arr,
            isAnalogInput: isAnalog,
            outputIsPaired: isPaired
        }) 
    }
    handleChoseOutputComponent = (component, cname, id) => {
        var arr = this.state.outputProps
        arr.push(new Array())
        var code_arr = this.state.codeOutput
        code_arr.push({})
        this.setState  ({
            chosenOutputComponents: this.state.chosenOutputComponents.concat([component]),
            chosenOutputComponentsNames: this.state.chosenOutputComponentsNames.concat([`${cname}${id}`]),
            outputProps: arr,
            codeOutput: code_arr,
        }) 
    }
    handleSerial = () => {
        this.setState({isSerial: true})
        console.log("set serial")
        var input = this.state.chosenInputComponents
        for(var i=0; i<input.length; i++) {
            input[i] = React.cloneElement(input[i], {
                isSerial: true
            });
        }
        var output = this.state.chosenOutputComponents
        for(var i=0; i<output.length; i++) {
            output[i] = React.cloneElement(output[i], {
                isSerial: true
            });
        }
        this.setState({
            chosenOutputComponents: output,
            chosenInputComponents: input
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
    handleCode = ({io, id, global, setup, loopstart, looplogic, loopelse, helper=[], analogInputParam="", analogOutputFunction=[]}) => {
        if (io === "INPUT") {
            var code_temp = this.state.codeInput
            code_temp[id] = {
                codeGlobal: global!==undefined? global:code_temp[id].codeGlobal,
                codeSetup: setup!==undefined? setup:code_temp[id].codeSetup,
                codeLoopStart: loopstart!==undefined? loopstart:code_temp[id].codeLoopStart,
                codeLoop: looplogic!==undefined? looplogic : code_temp[id].codeLoop,
                codeLoopElse: loopelse!==undefined? loopelse : code_temp[id].codeLoopElse,
                codeHelperFunction: helper!==undefined? helper : code_temp[id].codeHelperFunction,
                analogInput: analogInputParam!==undefined? analogInputParam : code_temp[id].analogInput,
                analogOutput: analogOutputFunction!==undefined? analogOutputFunction : code_temp[id].analogOutput

            }
            this.setState({codeInput: code_temp})
        }
        else{
            var code_temp = this.state.codeOutput
            code_temp[id] = {
                codeGlobal: global!==undefined? global:code_temp[id].codeGlobal,
                codeSetup: setup!==undefined? setup:code_temp[id].codeSetup,
                codeLoopStart: loopstart!==undefined? loopstart:code_temp[id].codeLoopStart,
                codeLoop: looplogic!==undefined? looplogic : code_temp[id].codeLoop,
                codeLoopElse: loopelse!==undefined? loopelse : code_temp[id].codeLoopElse,
                codeHelperFunction: helper!==undefined? helper : code_temp[id].codeHelperFunction,
                analogInput: analogInputParam!==undefined? analogInputParam : code_temp[id].analogInput,
                analogOutput: analogOutputFunction!==undefined? analogOutputFunction : code_temp[id].analogOutput
            }
            this.setState({codeOutput: code_temp})
        }
    }
    setAnalog = (id, paramName, paramMax) => {
        var isAnalog = this.state.isAnalogInput
        isAnalog[id] = {
            paramName: paramName,
            paramMax: paramMax
        }
        console.log(isAnalog[id])
        this.setState({isAnalogInput: isAnalog})
    }
    setComponentsAnalog = () => {
        console.log("set analog output")
        var output = this.state.chosenOutputComponents
        for(var pair_id=0; pair_id < this.state.ioPairs.length; pair_id++) {
            var a = this.state.isAnalogInput[pair_id]
            if(a != 0) {
                console.log(a)
                for(var i=0; i<this.state.ioPairs[pair_id].length; i++) {
                    var o = this.state.ioPairs[pair_id][i]
                    output[o] = React.cloneElement(output[o], {
                        isAnalog: true,
                        paramName: a.paramName,
                        paramMax: a.paramMax
                    });
                }
            }
        }
        this.setState({
            chosenOutputComponents: output
        })
    }

    handleCopy = () => {
        var textContainer = this.textContainerRef;
        console.log(textContainer)
        if (textContainer) {
            var textToCopy = textContainer.current.innerText;
            console.log(textToCopy)

            navigator.clipboard.writeText(textToCopy).then(function () {
                this.setState({ copied: true });
                setTimeout(function () {
                    this.setState({ copied: false });
                }.bind(this), 2000);
            }.bind(this)).catch(function (err) {
                console.error("Copy failed:", err);
            });
        }
    };

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
                                    setAnalog={this.setAnalog}
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
                        <Serial handleSerial={this.handleSerial}
                                getStage={this.getStage}
                                handleCode={this.handleCode}
                        />
                    
                    </div>
                    <div>
                        {this.state.chosenOutputComponents.map(el => {
                            console.log(el)
                            return el})}
                    </div>
                    <div>
                        {this.state.chosenInputComponents.map(el => el)}
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
                        <h3>For {this.state.chosenInputComponentsNames[this.state.ioPairingId]}:</h3>
                        {
                            this.state.chosenInputComponents[this.state.ioPairingId]
                        }
                        
                        <h3>Which output component would you like to pair it with?</h3>
                        {
                            this.state.ioPairs[this.state.ioPairingId].length > 0 ?
                            this.state.ioPairs[this.state.ioPairingId].map((el,index) => <p>{this.state.chosenOutputComponentsNames[el]}</p>)
                            :
                            <p>Click on the buttons below to add components. You may add more than one component if you want.</p>
                        }
                        <br/>
                        {
                            this.state.chosenOutputComponents.map((component, index) => {
                                if(this.state.outputIsPaired[index]) {
                                    return ""
                                }
                                return <button key={index} onClick={() => {
                                    var temp = this.state.ioPairs
                                    temp[this.state.ioPairingId] = temp[this.state.ioPairingId].concat([index])
                                    var isPaired = this.state.outputIsPaired
                                    isPaired[index] = 1
                                    this.setState({
                                        ioPairs: temp,
                                        outputIsPaired: isPaired
                                    })
                                }}> {this.state.chosenOutputComponentsNames[index]} </button>
                            }) /* TODO potential bug here?? */
                        }
                    </div>
                    {
                        this.state.ioPairingId < this.state.chosenInputComponents.length - 1 ?
                        <button onClick = {() => {
                            this.setState({
                                ioPairingId: this.state.ioPairingId + 1,
                                //outputIsPaired: this.state.outputIsPaired.fill(0)
                            })
                        }
                        }> next </button> :
                        <button onClick = {() => {
                            this.setState({stage: STAGE.DEFINE_BEHAVIOR})
                            this.setState({ioPairingId: 0})
                            this.setComponentsAnalog()
                        }} className='next-step-button'> next </button>
                    }
                </div>
            );
        }
        else if (this.state.stage === STAGE.DEFINE_BEHAVIOR) {
            return (
                <div className="main-wrapper">
                    <h2>Define Behavior</h2>
                    <br/>
                    <h3>When {this.state.chosenInputComponentsNames[this.state.ioPairingId]} is triggered: </h3>
                    {
                        
                        this.state.ioPairs[this.state.ioPairingId].map((idx, index) => {
                            return (
                                <>
                                    {/* <h4> Output {this.state.chosenOutputComponentsNames[idx]}: </h4> */}
                                    {this.state.chosenOutputComponents[idx]}
                                </>
                            )
                        }
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
            return (
                <div className="main-wrapper">
                    <h2>Render code</h2>
                    <br/>

                    <button onClick={() => this.handleCopy()} className="next-step-button">
                        {this.state.copied ? "Copied!" : "Copy"}
                    </button>

                    <div 
                        ref={this.textContainerRef}
                        className='code'
                    >
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
                            this.state.isSerial?
                            <pre>{formProgram(["Serial.begin(9600);"], 1)}</pre>:
                            ""
                        }
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
                                if(this.state.isAnalogInput[index] === 0) {
                                    var ret = [["if (" + this.state.codeInput[index].codeLoop[0] + ") {"]]
                                    var els = []
                                    for(var i=0; i<output_list.length; i++) {
                                        var output_idx = output_list[i]
                                        ret.push(this.state.codeOutput[output_idx].codeLoop)
                                        els.push(this.state.codeOutput[output_idx].codeLoopElse)
                                    }
                                    ret.push(["}"])
                                    console.log(els)
                                    if(els.length > 0) {
                                        ret.push(["else {"])
                                        for(var i=0; i<els.length; i++) {
                                            ret.push(els[i])
                                        }
                                        ret.push(["}"])
                                    }
                                    return (
                                        ret.map(el => {
                                            return <pre>{formProgram(el, 1)}</pre>
                                        })
                                    )
                                }
                                else {
                                    var ret = []
                                    for(var i=0; i<output_list.length; i++) {
                                        var output_idx = output_list[i]
                                        ret.push(this.state.codeOutput[output_idx].analogOutput)
                                    }
                                    return (
                                        ret.map(el => {
                                            return <pre>{formProgram(el, 1)}</pre>
                                        })
                                    )
                                }
                                
                            })
                        }

                        <>{'}'}</>
                        <br/>
                        <br/>

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

                    </div>

                    
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
    handleChoseOutput = (el, id) => {
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
            case 'Stepper Motor':
                obj = <Stepper handlePropsChange={this.props.handlePropsChange}
                        id={this.state.chosenOutput.length}
                        getStage={this.props.getStage}
                        handleCode={this.props.handleCode}
                        />
                break;
            default:
                console.log("error")
        }
        this.props.handleChoseOutputComponent(obj, el, this.state.chosenOutput.length)
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
                                setAnalog={this.props.setAnalog}
                                />
                break;
            case 'Potentiometer':
                obj = <Potentiometer handlePropsChange={this.props.handlePropsChange}
                                id={this.state.chosenInput.length}
                                getStage={this.props.getStage}
                                handleCode={this.props.handleCode}
                                setAnalog={this.props.setAnalog}
                                />
                break;
                /*TODO : add more objects */
            default:
                console.log("error")
        }
        this.props.handleChoseInputComponent(obj, el, this.state.chosenInput.length)
    }
    render() {
        return (
            <div>

                <h3>Chose Input Components</h3>
                {
                    this.state.chosenInput.length == 0?
                    <p>Click on the buttons below to add components. You may add more than one of each type if you want.</p> :
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
                    <p>Click on the buttons below to add components. You may add more than one of each type if you want.</p> :
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