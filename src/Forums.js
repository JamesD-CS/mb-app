import React from 'react';
import {
  useParams,
  useLocation,
  useNavigate
} from "react-router-dom";
import {useState, useEffect } from  'react';
import './Forums.css';

const PostForm = ({forum_data}) => {
  const navigate = useNavigate();

  function handlePost (e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log(formJson);
    const requestOptions = {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Accept':'*/*'
      },
      mode:'cors',
      body: formJson
      
    };
    console.log("POSTing data to API. Forum id is =" + forum_data);
  
    fetch("http://localhost:5005/forums/"+forum_data, requestOptions).then((response) => {
      console.log(response);
      alert("Message posted");
      navigate("/forums");
    });
    
  }
  return (
    <form onSubmit={handlePost}>
      <label>
        Title: <input name="title" />
      </label>
      <hr />
      <label>
        Messsage: <textarea id="body" name="body" />
      </label>
      <button type="submit">Post Message</button>
      <hr />
    </form >
  );
}

const PostDisplay = ({data}) =>{
  const DisplayData=data.map(
      (post)=>{
        console.log("inside first level map function post replies are:", post.replies);
        
        const replyrows = post.replies[0].map((reply) =>{
          
          console.log("inside second level map function reply is:", reply);
          return(
            <>
            <tr>
              <td colSpan = {1}></td>
              <td>ID:</td>
              <td>{reply.poster_id}</td>
              <td>Time:</td>
              <td>{reply.post_time}</td>
            </tr>
            <tr>
              <td colSpan = {1}></td>
              <td colSpan={2}>{reply.body}</td>
            </tr>
            </>
          ) 
         
        })
          return(
            <tbody>
              <tr>
                  <td>ID:</td>
                  <td>{post.poster_id}</td>
                  <td>Time:</td>
                  <td>{post.post_time}</td>
              </tr>
              <tr>
                  <td>Title:</td>
                  <td>{post.title}</td>
              </tr>
              <tr>
                  <td colSpan={2}>{post.body}</td>
              </tr>
              
                {replyrows}
              
            
            </tbody>
            
          )
      }
  )

  return(
      <div>
          <table class="table table-striped">
                  {DisplayData}
          </table>
          <table>

          </table>
      </div>
  )
};


export default function Forums(){
    const [forums, setForums] = useState([]);
    let  urlParams  = useParams();
    let forumId = urlParams.forumId;
    let forumInfo = useLocation();
    let forumName = forumInfo.state.forum_name;
    useEffect(() => {
      const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Accept':'*/*'
        },
        mode:'cors'
        
      };
      console.log("fetching data from API");
      console.log(forumId);
      console.log(forumName);
      fetch("http://localhost:5005/forums/"+forumId, requestOptions).then(response => response.json())
      .then((data) => {
        console.log(data);
        //console.log("forum id is", forumId.forumId);
        setForums(data);
        
      });

      }, []);

    return (
      
        <div className="App">
          <h1>Message board app</h1>
          <br />
          <h1>Forum : {forumName}</h1>
          <PostForm forum_data={forumId}/>
          <br/>
          <PostDisplay data={forums} />
          
        </div>
 
     
      
    );
     
  
  }
