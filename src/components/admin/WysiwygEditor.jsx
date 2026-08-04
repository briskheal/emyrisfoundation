import React, { useRef, useEffect, useState } from 'react';

const WysiwygEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [mode, setMode] = useState('visual'); // 'visual' or 'html'

  // Initialize content on mount and sync when value changes externally (e.g. initial load)
  useEffect(() => {
    if (mode === 'visual' && editorRef.current && editorRef.current.innerHTML !== value) {
      // Only update if it doesn't match to prevent cursor jumping during active typing
      // Because handleVisualInput updates `value` to equal `innerHTML`, this will only trigger on external changes
      editorRef.current.innerHTML = value || '';
    }
  }, [mode, value]);

  const handleVisualInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHtmlInput = (e) => {
    onChange(e.target.value);
  };

  const execCmd = (cmd, arg = null) => {
    if (mode !== 'visual') return;
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
    handleVisualInput();
  };

  return (
    <div className="wysiwyg-wrapper" style={{ border: '1px solid #444', borderRadius: '8px', overflow: 'hidden', background: '#1a1a1a' }}>
      <style>{`
        .wysiwyg-wrapper .editor-content-area h1,
        .wysiwyg-wrapper .editor-content-area h2,
        .wysiwyg-wrapper .editor-content-area h3,
        .wysiwyg-wrapper .editor-content-area h4,
        .wysiwyg-wrapper .editor-content-area h5,
        .wysiwyg-wrapper .editor-content-area h6 {
          color: white !important;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `}</style>
      {/* Toolbar */}
      <div style={{ padding: '10px', background: '#2d2d2d', borderBottom: '1px solid #444', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Toggle Mode Button */}
        <button 
          type="button" 
          onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')} 
          style={{ ...btnStyle, background: mode === 'html' ? 'var(--primary-orange)' : '#333' }} 
          title="Toggle HTML Source"
        >
          <i className="fa-solid fa-code"></i> {mode === 'html' ? ' Visual Mode' : ' HTML Mode'}
        </button>

        <div style={dividerStyle}></div>

        <button type="button" onClick={() => execCmd('bold')} style={btnStyle} title="Bold" disabled={mode === 'html'}>
          <i className="fa-solid fa-bold"></i>
        </button>
        <button type="button" onClick={() => execCmd('italic')} style={btnStyle} title="Italic" disabled={mode === 'html'}>
          <i className="fa-solid fa-italic"></i>
        </button>
        <button type="button" onClick={() => execCmd('underline')} style={btnStyle} title="Underline" disabled={mode === 'html'}>
          <i className="fa-solid fa-underline"></i>
        </button>
        
        <div style={dividerStyle}></div>

        <button type="button" onClick={() => execCmd('justifyLeft')} style={btnStyle} title="Align Left" disabled={mode === 'html'}>
          <i className="fa-solid fa-align-left"></i>
        </button>
        <button type="button" onClick={() => execCmd('justifyCenter')} style={btnStyle} title="Align Center" disabled={mode === 'html'}>
          <i className="fa-solid fa-align-center"></i>
        </button>
        <button type="button" onClick={() => execCmd('justifyRight')} style={btnStyle} title="Align Right" disabled={mode === 'html'}>
          <i className="fa-solid fa-align-right"></i>
        </button>

        <div style={dividerStyle}></div>

        <button type="button" onClick={() => execCmd('insertUnorderedList')} style={btnStyle} title="Bullet List" disabled={mode === 'html'}>
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <button type="button" onClick={() => execCmd('insertOrderedList')} style={btnStyle} title="Numbered List" disabled={mode === 'html'}>
          <i className="fa-solid fa-list-ol"></i>
        </button>

        <div style={dividerStyle}></div>

        {/* Font Selection */}
        <select onChange={(e) => execCmd('fontName', e.target.value)} style={selectStyle} defaultValue="" disabled={mode === 'html'}>
          <option value="" disabled>Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Impact">Impact</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>

        {/* Size Selection */}
        <select onChange={(e) => execCmd('fontSize', e.target.value)} style={selectStyle} defaultValue="" disabled={mode === 'html'}>
          <option value="" disabled>Size</option>
          <option value="1">Smallest</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Larger</option>
          <option value="6">Very Large</option>
          <option value="7">Huge</option>
        </select>

        <div style={dividerStyle}></div>

        <select onChange={(e) => execCmd('formatBlock', e.target.value)} style={selectStyle} defaultValue="" disabled={mode === 'html'}>
          <option value="" disabled>Format</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="P">Paragraph</option>
        </select>
        
        <input 
          type="color" 
          onChange={(e) => execCmd('foreColor', e.target.value)} 
          style={{ cursor: mode === 'html' ? 'not-allowed' : 'pointer', border: 'none', background: 'transparent', width: '30px', height: '30px', padding: 0 }} 
          title="Text Color"
          disabled={mode === 'html'}
        />
      </div>

      {/* Editor Area */}
      {mode === 'visual' ? (
        <div
          ref={editorRef}
          className="editor-content-area"
          contentEditable
          onInput={handleVisualInput}
          onBlur={handleVisualInput}
          style={{
            minHeight: '350px',
            padding: '20px',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            overflowY: 'auto'
          }}
        />
      ) : (
        <textarea
          value={value || ''}
          onChange={handleHtmlInput}
          style={{
            width: '100%',
            minHeight: '350px',
            padding: '20px',
            color: '#15F5BA', // Matrix green for code feel
            background: '#0d0d0d',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
            lineHeight: 1.6,
            fontSize: '1rem',
            resize: 'vertical'
          }}
          placeholder="<h1>Write raw HTML here...</h1>"
        />
      )}
    </div>
  );
};

const btnStyle = {
  background: '#333',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
  color: '#fff',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '35px',
  gap: '5px'
};

const dividerStyle = {
  width: '1px',
  background: '#555',
  margin: '0 5px',
  height: '24px'
};

const selectStyle = {
  background: '#333',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '6px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

export default WysiwygEditor;
