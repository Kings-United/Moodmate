import React from 'react';

const TextArea = ({
    value,
    onChange,
    placeholder = "How was your day? Share your thoughts...",
    disabled = false,
    maxLength = 5000
}) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="textarea-container">
            <label className="textarea-label">
                What's on your mind?
            </label>

            <textarea
                className="journal-textarea"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                rows={8}
            />

            <div className="textarea-footer">
                <span className="character-count">
                    {value.length} / {maxLength} characters
                </span>
            </div>
        </div>
    );
};

export default TextArea;