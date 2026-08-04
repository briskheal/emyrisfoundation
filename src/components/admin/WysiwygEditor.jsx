import React, { useRef, useEffect } from 'react';

const WysiwygEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div style={{ border: '1px solid #444', borderRadius: '8px', overflow: 'hidden', background: '#1a1a1a' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px', background: '#2d2d2d', borderBottom: '1px solid #444', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => execCmd('bold')} style={btnStyle} title="Bold">
          <i className="fa-solid fa-bold"></i>
        </button>
        <button type="button" onClick={() => execCmd('italic')} style={btnStyle} title="Italic">
          <i className="fa-solid fa-italic"></i>
        </button>
        <button type="button" onClick={() => execCmd('underline')} style={btnStyle} title="Underline">
          <i className="fa-solid fa-underline"></i>
        </button>
        
        <div style={dividerStyle}></div>

        <button type="button" onClick={() => execCmd('justifyLeft')} style={btnStyle} title="Align Left">
          <i className="fa-solid fa-align-left"></i>
        </button>
        <button type="button" onClick={() => execCmd('justifyCenter')} style={btnStyle} title="Align Center">
          <i className="fa-solid fa-align-center"></i>
        </button>
        <button type="button" onClick={() => execCmd('justifyRight')} style={btnStyle} title="Align Right">
          <i className="fa-solid fa-align-right"></i>
        </button>

        <div style={dividerStyle}></div>

        <button type="button" onClick={() => execCmd('insertUnorderedList')} style={btnStyle} title="Bullet List">
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <button type="button" onClick={() => execCmd('insertOrderedList')} style={btnStyle} title="Numbered List">
          <i className="fa-solid fa-list-ol"></i>
        </button>

        <div style={dividerStyle}></div>

        <select onChange={(e) => execCmd('formatBlock', e.target.value)} style={selectStyle} defaultValue="">
          <option value="" disabled>Format</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="P">Paragraph</option>
        </select>
        
        <input 
          type="color" 
          onChange={(e) => execCmd('foreColor', e.target.value)} 
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', width: '30px', height: '30px', padding: 0 }} 
          title="Text Color"
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        style={{
          minHeight: '350px',
          padding: '20px',
          color: '#fff',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.6,
          fontSize: '1.1rem'
        }}
      />
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
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '35px'
};

const dividerStyle = {
  width: '1px',
  background: '#555',
  margin: '0 5px'
};

const selectStyle = {
  background: '#333',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '6px',
  color: '#fff',
  cursor: 'pointer'
};

export default WysiwygEditor;
