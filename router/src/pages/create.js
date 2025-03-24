import React, { useState } from "react";

const Create = () => {
  const [routeName, setRouteName] = useState(""); 
  const [grade, setGrade] = useState(""); 
  const [incline, setIncline] = useState(0);
  const [description, setDesc] = useState(""); 
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log({ routeName, grade, incline, description, notes });
  };

  return (
    <div style={{ maxWidth: '100%', margin: 'auto', padding: '20px', background: 'white', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '16px' }}>Create Route</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="routeName" style={{ display: 'block', marginBottom: '8px' }}>Route Name</label>
          <input 
            id="routeName"
            type="text"
            fullWidth
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)} 
            placeholder="Enter route name"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
        <label htmlFor="grade" style={{ display: 'block', marginBottom: '8px' }}>Grade</label>
            <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: 8 }, (_, i) => `V${i + 1}`).map((gradeLabel) => (
                <button 
                    key={gradeLabel}
                    type="button"
                    onClick={() => setGrade(gradeLabel)} 
                    style={{
                    padding: '10px',
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: grade === gradeLabel ? '#8390FA' : '#fff', 
                    color: grade === gradeLabel ? '#fff' : '#000', 
                    }}
                >
                    {gradeLabel}
                </button>
                ))}
            </div>
        </div>
            
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <label 
                htmlFor="incline" 
                style={{ display: 'inline-block', marginRight: '16px', width: '100px', }}
            > Wall Incline
            </label>
            <input 
                id="inclineSlider"
                type="range"
                min="0"
                max="180"
                value={incline}
                onChange={(e) => setIncline(Number(e.target.value))}
                style={{
                width: '80%',
                marginRight: '16px', 
                }}
            />
            <input 
                id="incline"
                type="number"
                value={incline}
                onChange={(e) => setIncline(Number(e.target.value))}
                style={{
                width: '60px', 
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                }}
            />
        </div>


        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '8px' }}>Description</label>
          <input 
            id="description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDesc(e.target.value)} 
            placeholder="Enter route information."
            style={{ width: '100%',
                    padding: '8px',
                    borderRadius: '4px', 
                    border: '1px solid #ccc', 
                    height: '150px'}}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="notes" style={{ display: 'block', marginBottom: '8px' }}>Additional Notes</label>
          <input 
            id="notes"
            type="text"
            fullWidth
            value={notes}
            onChange={(e) => setNotes((e.target.value))} 
            placeholder="Extra notes (safety, concerns, etc.)"
            style={{ width: '100%',
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',  
                    height: '150px', 
                    resize: 'vertical'}}
            required
          />
        </div> 

        <button 
          type="submit" 
          style = {{  borderRadius: '4px'}}
          >
          Submit
        </button>
      </form>
    </div>



  );
};

export default Create;


