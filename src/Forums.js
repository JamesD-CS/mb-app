import React from 'react';
import {
  useParams,
  useLocation,
  useNavigate, 
} from "react-router-dom";
import { createPortal } from 'react-dom';
import {useState, useEffect } from  'react';
import ModalContent from './ReplyModal.js';
import './Forums.css';

//import { DateTime } from 'luxon';

const PostForm = ({forum_data, post_id}) => {
  const navigate = useNavigate();

  let isNewPost = true;

  if (post_id.length > 0){
    isNewPost = false;
  }
  
  function handlePost (e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log(formJson);

    
    let postendpoint = "http://localhost:5005/forums/";
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

    //Is this a new post or a reply to an existing post? Set API endpoint accordingly
    if (isNewPost){
      postendpoint += forum_data;
    }else{
      postendpoint += forum_data + '/' + post_id; 
    }
    console.log('Posting to API endpoint at:', postendpoint);
    
    //Post message to api.
    fetch(postendpoint, requestOptions).then((response) => {
      console.log(response);
      alert("Message posted");
      navigate(0);
    });
    
  }
  return (
    <form onSubmit={handlePost}>
      
      {isNewPost &&
      <>
      <label>
        Title: <input name="title" />
      </label>
      <hr />
      </>
      }
      <label>
        Messsage:
        <br />
         <textarea id="body" name="body" />
      </label>
      <br />
      <br />
      <button type="submit">{isNewPost ? 'Post Message' : 'Post Reply'}</button>
      <hr />
    </form >
  );
}


const PostDisplay = ({data, forum_id}) =>{

  const ReplyRows = ({replies, colspan}) =>{
    //console.log('inside replyrows replies are', replies);
    let replyrows = [];
      if(replies){
      replies.map((reply) =>{
        if (reply.replies[0]){
            //console.log('reply replies are:', reply.replies[0]);
        }
        //console.log("inside second level map function reply is:", reply);
        replyrows.push(

            <table className="reply-table">
              <tbody>
              <tr>
                <td colSpan = {colspan +1} className='hidden'></td>
                <td>ID:</td>
                <td>{reply.poster_id}</td>
                <td>Time:</td>
                <td>{reply.post_time}</td>
              </tr>
              <tr>
                <td colSpan = {colspan} className='hidden'></td>
                <td colSpan={colspan + 1}>{reply.body}</td>
              </tr>
              <tr>
                <td colSpan = {colspan} className='hidden'></td>
                <td>
                  <div id = {reply.poster_id}> 
                    <ReplyPortal div_id={reply.poster_id} poster_id = {reply.poster_id} forum_id={forum_id}/>          
                  </div>
                </td>
              </tr>  
            </tbody>
          </table>
        )
      })
    }
    return replyrows;
    
  };

  const DisplayData=data.map(
      (post)=>{

       //console.log("inside first level map function post replies are:", post.replies);
       
          return(
            <div id = {post.poster_id}>
            <table >
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
                <tr>
                  <td>
                    <div id = {post.poster_id}>
                      <ReplyPortal div_id={post.poster_id} poster_id={post.poster_id} forum_id={forum_id} />  
                    </div>
                  </td>
                </tr>
             
            </tbody>
            </table>
            <ReplyRows replies={post.replies[0]} colspan ={1}/>
            </div>
            
          )
      }
  )

  return(
      <div>
          
                  {DisplayData}

      </div>
  )
};

const ReplyPortal = ({div_id, poster_id, forum_id}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {!showModal &&
      <button onClick={() => setShowModal(true)}>
        Reply
      </button>
      }
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)}  poster_id = {poster_id} forum_id={forum_id} />,
        document.getElementById(div_id)
      )}
    </>
  );
}

export default function Forums(){
    const [forums, setForums] = useState([]);
    let  urlParams  = useParams();
    let forumId = urlParams.forumId;
    let forumInfo = useLocation();
    let forumName = forumInfo.state.forum_name;

    const fetchData = () => {

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
        console.log('json response from API is:',data);
        //console.log("forum id is", forumId.forumId);
        setForums(data);
        
      });
     
    };
    
    useEffect(() => {
      
      fetchData();

      }, []);

    return (
        <div className="App">
          <h1>Message board app</h1>
          <br />
          <h1>Forum : {forumName}</h1>
          <PostForm forum_data={forumId} post_id={''}/>
          <br/>
          
          <br />
          <PostDisplay data={forums} forum_id={forumId} />
          
        </div>
    );
      
  }
