import { useState, useEffect } from "react";

//Component that gives you 5 sec to undo a checked box. after 5 sec
//If undo isn't clicked within 5sec, mark task ac isChecked
//prop "onExpire"

export const UndoDeletion = ({ onUndo, onExpire, taskText }) => {
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        setSecondsLeft(5);
    }, [taskText]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onExpire();
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((s) => s - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft, onExpire]);

    return (
        <div className="undo-container">
            <div className="trashcan-container">
                <i className="fa-regular fa-trash-can undo-trashcan" onClick={onUndo}></i>
            </div>

            <div className="undo-content-container">
                <h4>Task deleted</h4>
                <p>
                    You have {secondsLeft} seconds to undo.
                </p>
            </div>
            <div className="undo-button-container">
                <button onClick={onUndo}>UNDO</button>
            </div>

        </div>
    );
};