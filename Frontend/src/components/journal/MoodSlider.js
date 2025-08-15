import React from 'react';
import { MOOD_LABELS, MOOD_COLORS } from '../../utils/constants';

const MoodSlider = ({ value, onChange, disabled = false }) => {
    const handleChange = (e) => {
        onChange(parseInt(e.target.value));
    };

    return (
        <div className="mood-slider">
            <label className="mood-slider-label">
                How are you feeling today?
            </label>

            <div className="mood-slider-container">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="mood-slider-input"
                    style={{
                        background: `linear-gradient(to right, ${MOOD_COLORS[1]} 0%, ${MOOD_COLORS[10]} 100%)`
                    }}
                />

                <div className="mood-slider-display">
                    <div
                        className="mood-value"
                        style={{ color: MOOD_COLORS[value] }}
                    >
                        {value}
                    </div>
                    <div className="mood-label">
                        {MOOD_LABELS[value]}
                    </div>
                </div>
            </div>

            <div className="mood-scale">
                <span>Terrible (1)</span>
                <span>Amazing (10)</span>
            </div>
        </div>
    );
};

export default MoodSlider;