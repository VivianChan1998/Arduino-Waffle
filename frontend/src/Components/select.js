import React from "react";
import { useState, useEffect, useCallback } from 'react';
import { redirect } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Select(){
    const [components, setComponents] = useState({input: [], output: []});
    const [selectedInputOptions, setSelectedInputOptions] = useState([]);
    const [selectedOutputOptions, setSelectedOutputOptions] = useState([]);
    const navigate = useNavigate();

   useEffect(() => {
      fetch('http://127.0.0.1:5000/list_components', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
         .then((res) => res.json())
         .then((data) => {
            var temp = {
                input: data['input'].split(','),
                output: data['output'].split(',')
            }
            setComponents(temp);
         })
         .catch((err) => {
            console.log(err.message);
         });
    }, []);

    const handleCheckboxChange = (event, io) => {
        const { value, checked } = event.target;
        if (io === 'input') {
            if (checked) {
                setSelectedInputOptions([...selectedInputOptions, value]);
            } else {
                setSelectedInputOptions(selectedInputOptions.filter((option) => option !== value));
            }
        } else {
            if (checked) {
                setSelectedOutputOptions([...selectedOutputOptions, value]);
            } else {
                setSelectedOutputOptions(selectedOutputOptions.filter((option) => option !== value));
            }
        }
    };

    const [isSending, setIsSending] = useState(false)
    const sendRequest = useCallback(async str => {
        if (isSending) return
        setIsSending(true)

        fetch('http://127.0.0.1:5000/chosen_components', {
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
            body: str
        })
        .then((res) => res.json())
        .then((data) => {
            if (data["status"] === "ok") {
                console.log("here")
                navigate("/init_question", { replace: true });
            }
        })
        .catch((err) => {
            console.log(err.message);
        });

        //await API.sendRequest()
        setIsSending(false)
    }, [isSending])

    
   return(
            <div>
                {components['input'].map((option, index) => (
                    <div key={index}>
                    <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        value={option}
                        onChange={e => handleCheckboxChange(e, 'input')}
                    />
                    <label htmlFor={`checkbox-${index}`}>{option}</label>
                    </div>
                ))}
                <br/>
                {components['output'].map((option, index) => (
                    <div key={index}>
                    <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        value={option}
                        onChange={e => handleCheckboxChange(e, 'output')}
                    />
                    <label htmlFor={`checkbox-${index}`}>{option}</label>
                    </div>
                ))}
                <input type="button" disabled={isSending} onClick={() => sendRequest(JSON.stringify({input: selectedInputOptions, output: selectedOutputOptions}))} value="Send" />
            </div>
        )
}