import { useState } from "react";
import { AnswerType } from "./Enums.js";

const Question = ({ setParamTo, parameterKeyname, questionText, answerType, answerOptions = [], followUpQuestion = null }) => {
    const [answer, setAnswer] = useState(null);

    const handleAnswer = (ans) => {
        let processedAnswer;
        if (answerType === AnswerType.MULTI_OPTION) {
            processedAnswer = answerOptions[parseInt(ans)].value;
        } else if (answerType === AnswerType.NUMERICAL) {
            processedAnswer = parseInt(ans);
        } else if (answerType === AnswerType.TEXT) {
            processedAnswer = ans;
        }

        setAnswer(processedAnswer);
        setParamTo[parameterKeyname] = processedAnswer;

        followUp(parseInt(ans));
    };

    const followUp = (ans) => {
        if (answerType === AnswerType.MULTI_OPTION) {
            const selectedAnswer = answerOptions[ans];
            if (selectedAnswer.followUp) {
                selectedAnswer.followUp.ask();
            } else if (selectedAnswer.callbackFunction) {
                selectedAnswer.callbackFunction();
            }
        }
    };

    return (
        <div>
            <p>{questionText}</p>
            {answerOptions.length > 0 ? (
                <select onChange={(e) => handleAnswer(e.target.value)}>
                    {answerOptions.map((a, index) => (
                        <option key={index} value={index}>{a.text}</option>
                    ))}
                </select>
            ) : (
                <input type="text" onBlur={(e) => handleAnswer(e.target.value)} />
            )}
        </div>
    );
};

const Answer = ({ answerText, value, followUp = null, callbackFunction = null }) => {
    return {
        text: answerText,
        value,
        followUp,
        callbackFunction,
    };
};