import React from "react";
import "./test.css"; // Import your CSS file

const Card = ({ cardString }) => {
    const calculateBackgroundPosition = () => {
        const cardWidth = 61.46;
        const cardHeight = 86;

        // Map card values to corresponding positions in the sprite sheet
        const valuePositions = {
            A: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5,
            7: 6,
            8: 7,
            9: 8,
            10: 9,
            J: 10,
            Q: 11,
            K: 12,
        };

        // Map suits to corresponding positions in the sprite sheet
        const suitPositions = {
            h: 0,
            s: 1,
            d: 2,
            c: 3,
        };

        const value = cardString.slice(0, -1); // Extract the value from the card code
        const suit = cardString.slice(-1); // Extract the suit from the card code

        const valuePosition = valuePositions[value] || 0;
        const suitPosition = suitPositions[suit] || 0;

        return `${valuePosition * -cardWidth}px ${
            suitPosition * -cardHeight
        }px`;
    };
    if (cardString) {
        return (
            <div className="card-container">
                <div
                    className="card"
                    style={{
                        backgroundPosition: calculateBackgroundPosition(),
                    }}
                ></div>
            </div>
        );
    } else return;
};

export default Card;
