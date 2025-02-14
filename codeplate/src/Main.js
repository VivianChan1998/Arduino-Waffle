import React from 'react';
import LED from './Arduino_Components/LED';
import Button from './Arduino_Components/Button';

const STAGE = Object.freeze({
    CHOOSE_COMPONENT: 0,
    INIT_QUESTION: 1,
    IO_PAIRING: 2,
    DEFINE_BEHAVIOR: 3,
    RENDER_CODE: 4
});

export default class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            stage: STAGE.CHOOSE_COMPONENT,
            availableInputComponents: [],
            availableOutputComponents: ['LED'],
            chosenInputComponentsNames: ["button"], /* TODO: update this when chosing */
            chosenInputComponents: [<Button/>, <Button/>], //temp
            chosenOutputComponentsNames: ["LED"], //temp
            chosenOutputComponents: [<LED/>], //temp
            ioPairingId: 0,
            ioPairs: [[], []], //temp
        }
    }
    handleChoseInputComponent = (component) => {
        this.setState  ({
            chosenInputComponents: this.state.chosenInputComponents.concat([component]), 
            ioPairs: this.state.ioPairs.push([[]])
        }) 
    }
    handleChoseOutputComponent = (component) => {
        this.setState  ({
            chosenOutputComponents: this.state.chosenOutputComponents.concat([component])
        }) 
    }
    render() {
        if (this.state.stage === STAGE.CHOOSE_COMPONENT) {
            return (
                <div>
                    <ChooseComponent availableInputComponents={this.state.availableInputComponents}
                                    availableOutputComponents={this.state.availableOutputComponents}
                                    handleChoseInputComponent={this.handleChoseInputComponent}
                                    handleChoseOutputComponent={this.handleChoseOutputComponent}
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
            console.log(this.state.ioPairingId)
            console.log(this.state.ioPairs[this.state.ioPairingId])
            return (
                <div>
                    define behavior
                    for the {this.state.chosenInputComponentsNames[this.state.ioPairingId]} component:
                    {
                        this.state.ioPairs[this.state.ioPairingId].map((idx, index) => {
                            return this.state.chosenOutputComponents[idx]
                        })
                    }


                </div>
            );
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
    handleChoseOutput = (obj, el) => {
        this.props.handleChoseOutputComponent(obj)
        this.setState({
            chosenOutput: this.state.chosenOutput.concat([el])
        })  
    }
    render() {
        return (
            <div>
                <h2>Chosen Output Components</h2>
                {
                    this.state.chosenOutput.map( (name, idx) => <p key={idx}> {name} </p>)
                }
                <div>
                    {
                        this.props.availableOutputComponents.map((el, index) => {
                            return <button key={index} onClick={ () => this.handleChoseOutput(<LED/>, el)} > {el} </button>
                        }) /* TODO: new an object based on name */
                    }
                </div>
                {/* TODO: do the same thing for chose input components */}
            </div>
        );
    }
}