const parseContent = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    // Check if there are enough lines to parse content
    if (lines.length < 2) {
        return false; // At least title and intro are required
    }

    let res = {}
    res['title'] = lines[0].split('.').filter(line => line !== '')
    res['items'] = lines.slice(1, lines.length ).map(line =>  line.replace(/\*/g , ''))
    
    return res
  }
  
  const generateTravelInfo = (content) => {
    return (
      <div>
        {content.title.map( (item, index) => (
          <p key={index+100}>{item.replace(/\*/g , '') + '.' }</p>
        ) )}
        
        <ul>
          {(content.items).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  export {generateTravelInfo, parseContent }