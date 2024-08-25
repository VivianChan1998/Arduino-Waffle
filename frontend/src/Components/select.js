import React from "react";
import { useState, useEffect, useCallback } from 'react';

export default function Select(){
    const [components, setComponents] = useState([]);
    const [chosen, setChosen] = useState(['button'])

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
            console.log(data);
            setComponents(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
    }, []);

    const [isSending, setIsSending] = useState(false)
    const sendRequest = useCallback(async () => {
        if (isSending) return
        setIsSending(true)

        fetch('http://127.0.0.1:5000/chosen_components', {
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({components: chosen})
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });

        //await API.sendRequest()
        setIsSending(false)
    }, [isSending])


    
   return(
            <div>
                {components['input']}
                <br/>
                {components['output']}
                <input type="button" disabled={isSending} onClick={sendRequest} />
            </div>
        )
}