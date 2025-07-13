import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import './style.css';
import img from './comm.jpeg';
import { REACT_APP_CHATBOT_SQL_API, REACT_APP_CHATBOT_BACKEND_API } from 'react-dotenv';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Chatbot = () => {
  const navigate = useNavigate();
  const [chatbox, setChatbox] = useState([
    { content: 'Hi there 👋<br>How can I help you today?', className: 'incoming' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [inputHeight, setInputHeight] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState(null);
  const [totalResponseTime, setTotalResponseTime] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedTopicsString, setSelectedTopicsString] = useState('');
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const [enterKeyDisabled, setEnterKeyDisabled] = useState(false);


  const topics = [
    { value: 'Little Women', label: 'Little Women' },
    { value: 'The Importance of Being Earnest', label: 'The Importance of Being Earnest' },
    { value: 'Great Expectations', label: 'Great Expectations' },
    { value: 'Alices Adventure in Wonderland', label: 'Alices Adventure in Wonderland' },
    { value: 'Anne of the Green Gables', label: 'Anne of the Green Gables' },
    { value: 'Adventures of Sherlock Holmes', label: 'Adventures of Sherlock Holmes' },
    { value: 'Adventures of Tom Sawyer', label: 'Adventures of Tom Sawyer' },
    { value: 'Oliver Twist', label: 'Oliver Twist' },
    { value: 'The Great Gatsby', label: 'The Great Gatsby' },
    { value: 'Frankenstein', label: 'Frankenstein' },
    { value: 'Dracula', label: 'Dracula' },
    { value: 'All', label: 'All' },
  ];




  const createChatLi = (message, className) => {
    return {
      content: message,
      className: className
    };
  };

  useEffect(() => {
    
    if (totalResponseTime !== null) {
      
      const sendValuesToBackend = async () => {
        try {

          const userQuery = sessionStorage.getItem('UserQuery') || '';
          let relevance = 2;
          
          const category = sessionStorage.getItem('Category') || '';
          const queryWithoutSpaces = userQuery.replace(/\s/g, ''); 
          const responseTime = totalResponseTime;
          const queryLength = queryWithoutSpaces.length;

          const response = await fetch(`${REACT_APP_CHATBOT_SQL_API}/insertValues`, {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userQuery,
              relevance,
              category,
              responseTime,
              queryLength,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          sessionStorage.removeItem("Category")
          console.log('Values sent to the backend successfully:', data);
        } catch (error) {
          console.error('Error sending values to the backend:', error);
        }
      };
      
      setTotalResponseTime(null);
      sendValuesToBackend();
    }
  }, [totalResponseTime]);

  const handleLike = async() => {
    try{
    sessionStorage.setItem('likedMessage', 1);
    const userQuery = sessionStorage.getItem('UserQuery') || '';
    let relevance = 1;
    setLiked(true); 
    setDisliked(false); 
    const category = sessionStorage.getItem('Category') || '';
    const responseTime = totalResponseTime;
    const queryLength = userQuery.length;

    const response = await fetch(`${REACT_APP_CHATBOT_METRICS_API}/updateValues`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userQuery,
              relevance,
              category,
              responseTime,
              queryLength,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          sessionStorage.removeItem("Category")
          console.log('Values sent to the backend successfully for like:', data);
        } catch (error) {
          console.error('Error sending values to the backend for like:', error);
        }
  };

  const handleUnlike = async () => {
    try{
      sessionStorage.setItem('likedMessage', 1);
      const userQuery = sessionStorage.getItem('UserQuery') || '';
      let relevance = 0;
      setLiked(false); 
      setDisliked(true); 
      const category = sessionStorage.getItem('Category') || '';
      const responseTime = totalResponseTime;
      const queryLength = userQuery.length;
  
      const response = await fetch(`${REACT_APP_CHATBOT_SQL_API}/updateValues`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userQuery,
                relevance,
                category,
                responseTime,
                queryLength,
              }),
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            const data = await response.json();
            sessionStorage.removeItem("Category")
            console.log('Values sent to the backend successfully for unlike:', data);
          } catch (error) {
            console.error('Error sending values to the backend for unlike:', error);
          }
  };

//   const handleCheckboxChange = (value) => {
//     setSelectedTopics((prevSelectedTopics) => {
//       const isAlreadySelected = prevSelectedTopics.includes(value);
//       const updatedTopics = isAlreadySelected
//         ? prevSelectedTopics.filter((topic) => topic !== value)
//         : [...prevSelectedTopics, value];
  
//       console.log("Selected Topics: ", updatedTopics);
//       return updatedTopics;
//     });
//   };
  
const handleCheckboxChange = (value) => {
    setSelectedTopics((prevSelectedTopics) => {
      const isAlreadySelected = prevSelectedTopics.includes(value);
      const updatedTopics = isAlreadySelected
        ? prevSelectedTopics.filter((topic) => topic !== value)
        : [...prevSelectedTopics, value];

      console.log("Selected Topics: ", updatedTopics);

      // Update the string representation of selected topics
      const topicsString = updatedTopics.join(' ');
      setSelectedTopicsString(topicsString);

      return updatedTopics;
    });
  };


  const handleChat = async () => {
    const trimmedMessage = userMessage.trim();
    const start = performance.now();
    setSendButtonDisabled(true);
    setEnterKeyDisabled(true);
    
    setResponseStartTime(start);
    
    if (!trimmedMessage) return;
    
    const newChatbox = [...chatbox, createChatLi(trimmedMessage, 'outgoing')];
    setChatbox(newChatbox);
    setUserMessage('');
    setLoading(true);

    try {
        sessionStorage.setItem("UserQuery",trimmedMessage);
    if(selectedTopics.length==0){
      // Make an actual API call to your backend
      
     const response = await fetch(`${REACT_APP_CHATBOT_BACKEND_API}/query/classify`, {
        //const response = await fetch('http://localhost:5000/query/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data1 = await response.json();
      console.log("Data is: ", data1.ANSWER);
      sessionStorage.setItem("Category",data1.ANSWER.categories[0])
      // 1: General. 2: Novels
      if(data1.ANSWER.query_category==2){
        try {
          console.log("Without Selection Novel")
          // Make an actual API call to your backend
         const response = await fetch(`${REACT_APP_CHATBOT_BACKEND_API}/query`, {
            

            //const response = await fetch('http://localhost:5000/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category:data1.ANSWER.categories[0],uInput: trimmedMessage }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("Data is: ", data);
          
          // Display the real response in the chatbox after a delay
          setTimeout(() => {
            const incomingChatLi = createChatLi(data.ANSWER, 'incoming');
            setChatbox([...newChatbox, incomingChatLi]);
            setLoading(false);
            const end = performance.now();
            setTotalResponseTime((end - start)/1000);
            
            sessionStorage.setItem("ResponseTime",totalResponseTime);
            sessionStorage.setItem("likedMessage",0);
            sessionStorage.setItem("unlikedMessage",0);
          }, 600);
        } catch (error) {
          console.error('Error fetching response from the API', error);
          setLoading(false);
        }
        finally {
          setSendButtonDisabled(false);
          setEnterKeyDisabled(false);
        }
      }

      else{

        try {
          console.log("Without Selection")  
          sessionStorage.setItem("Category","General")
          // Make an actual API call to your backend
          const response = await fetch(`${REACT_APP_CHATBOT_SQL_API}/generalChat`, {
           // const response = await fetch('http://localhost:5000/generalChat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uInput: trimmedMessage }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          
    
          // Display the real response in the chatbox after a delay
          setTimeout(() => {
            const incomingChatLi = createChatLi(data.ANSWER, 'incoming');
            setChatbox([...newChatbox, incomingChatLi]);
            setLoading(false);
            const end = performance.now();
            setTotalResponseTime((end - start)/1000);
            
            sessionStorage.setItem("ResponseTime",totalResponseTime);
            sessionStorage.setItem("likedMessage",0);
            sessionStorage.setItem("unlikedMessage",0);
          }, 600);
        } catch (error) {
          console.error('Error fetching response from the API', error);
          setLoading(false);
        }
        finally {
          setSendButtonDisabled(false);
          setEnterKeyDisabled(false);
        }
      }

    }
    else{
        try {

            const response = await fetch(`${REACT_APP_CHATBOT_BACKEND_API}/query/classify`, {
        //const response = await fetch('http://localhost:5000/query/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmedMessage }),
      });
      console.log("Hi, we are here.")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data1 = await response.json();
      console.log("Data is: ", data1.ANSWER);
      sessionStorage.setItem("Category",data1.ANSWER.categories[0])
      // 1: General. 2: Novels
      if(data1.ANSWER.query_category==2){
        try {
            const uInput = `${trimmedMessage} ${selectedTopicsString}`;
            
            const response = await fetch(`${REACT_APP_CHATBOT_BACKEND_API}/query`, {
            //const response = await fetch('http://localhost:5000/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ topic:0,uInput: trimmedMessage }),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const data = await response.json();
            console.log("Data is: ", data);
            
            
            setTimeout(() => {
              const incomingChatLi = createChatLi(data.ANSWER, 'incoming');
              setChatbox([...newChatbox, incomingChatLi]);
              setLoading(false);
              const end = performance.now();
              setTotalResponseTime((end - start)/1000);
              sessionStorage.setItem("Category","All")
              sessionStorage.setItem("ResponseTime",totalResponseTime);
              sessionStorage.setItem("likedMessage",0);
              sessionStorage.setItem("unlikedMessage",0);
            }, 600);
        } catch (error) {
          console.error('Error fetching response from the API', error);
          setLoading(false);
        }
        finally {
          setSendButtonDisabled(false);
          setEnterKeyDisabled(false);
        }
      }

      else{

        try {
          console.log("Without Selection")  
          sessionStorage.setItem("Category","General")
          // Make an actual API call to your backend
          const response = await fetch('http://34.125.247.58:5000/generalChat', {
           // const response = await fetch('http://localhost:5000/generalChat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uInput: trimmedMessage }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          
    
          // Display the real response in the chatbox after a delay
          setTimeout(() => {
            const incomingChatLi = createChatLi(data.ANSWER, 'incoming');
            setChatbox([...newChatbox, incomingChatLi]);
            setLoading(false);
            const end = performance.now();
            setTotalResponseTime((end - start)/1000);
            
            sessionStorage.setItem("ResponseTime",totalResponseTime);
            sessionStorage.setItem("likedMessage",0);
            sessionStorage.setItem("unlikedMessage",0);
          }, 600);
        } catch (error) {
          console.error('Error fetching response from the API', error);
          setLoading(false);
        }
        finally {
          setSendButtonDisabled(false);
          setEnterKeyDisabled(false);
        }
      }
          
            
          
          } catch (error) {
            console.log("Error Message: ", trimmedMessage);
            console.error('Error fetching response from the API', error);
            setLoading(false);
          }
    }
    } catch (error) {
      console.error('Error fetching response from the API', error);
      const errorChatLi = createChatLi('Sorry, we could not find relevant response for your query, could you try rephrasing?', 'incoming error');
      setChatbox([...newChatbox, errorChatLi]);
      setLoading(false);
      setLoading(false);
    }
    finally {
      setSendButtonDisabled(false);
      setEnterKeyDisabled(false);
    }
  };

  useEffect(() => {
    setInputHeight(`${inputHeight}px`);
  }, [userMessage, inputHeight]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !enterKeyDisabled) {
      e.preventDefault();
      handleChat();
    }
  };
  

  const handleVisualizationClick = () => {
    
    navigate('/visualisation')
  };

  return (
    <div>
    <div>
      <button className="settings-button" onClick={handleVisualizationClick}>
        Visualisation
      </button>
      
    </div>
    <div className="container">
      <div className="chatbot">
        <header>
          <h2>Chatbot</h2>
        </header>
        <ul className="chatbox">
          {chatbox.map((chat, index) => (
         <li key={index} className={`chat ${chat.className}`}>
         <div dangerouslySetInnerHTML={{ __html: chat.content }} />
         {chat.className === 'incoming' && index === chatbox.length - 1 && (
           <div className="like-dislike-buttons">
            <button className={`like-button ${liked ? 'highlight' : ''}`} onClick={handleLike}>
              <span role="img" aria-label="thumbs-up">👍</span> Like
            </button>
            <button className={`dislike-button ${disliked ? 'highlight' : ''}`} onClick={handleUnlike}>
              <span role="img" aria-label="thumbs-down">👎</span> Dislike
            </button>
           </div>
         )}
       </li>
       
        
        
         
          ))}
          {loading && (
            <li className="chat incoming loading-dots">
              <MoonLoader css={override} size={25} color={'#2196F3'} loading={loading} />
              
            </li>
          )}
        </ul>
        <div className="chat-input">
        <textarea
          placeholder="Enter a message..."
          spellCheck="false"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ height: inputHeight, pointerEvents: sendButtonDisabled ? 'none' : 'auto' }}
        ></textarea>

          <span
              id="send-btn"
              className={`material-symbols-rounded ${sendButtonDisabled ? 'disabled' : ''}`}
              onClick={sendButtonDisabled ? null : handleChat}
              style={{ pointerEvents: sendButtonDisabled ? 'none' : 'auto' }}
            >
              Send
            </span>


        </div>
      </div>

      <div className="topics">
      <h3>Select a Topic</h3>
        <div className="checkbox-group">
        {topics.map((topic) => (
            <label key={topic.value}>
                <input
                type="checkbox"
                name="topics"
                value={topic.value}
                onChange={() => handleCheckboxChange(topic.value)}
                checked={selectedTopics.includes(topic.value)}
                />
                {topic.label}
            </label>
            ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
