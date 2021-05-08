import React,{ useState,useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db,auth } from './firebase'
import { Button, Input, makeStyles } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';

//for Modal Designing form material-ui

function getModalStyle(){
  const top = 50;
  const left = 50;
   
  return{
    top : `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
}));

//-------------------

// app function

function App() {
  //states that are used in our app
  const classes = useStyles();
  const [modalstyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [username,setUserName] = useState('');
  const [user,setUser] = useState(null);
  //---------------
  //effect method for authentication user
   useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged((authUser) => {
       if(authUser){
         // user logged in
         setUser(authUser);
         console.log(authUser);
       } else{
         //user logged out
         setUser(null);
       }
     })
     return () => {
       //perform some cleanup action
       unsubscribe();
     }
   },[user, username])

  useEffect(() => {
    db.collection('Posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
     
      setPosts(snapshot.docs.map(doc =  > (
        {
          id : doc.id,
         post: doc.data()
        })));
      console.log(snapshot);
    })
  }, []);
  
  //-------------

  //for handling signup button function
  const handleSignUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false);
   }
  //----------------------

  //for handling signin nutton function 
   const handleSignin = (event) => {
     event.preventDefault();
     auth
       .signInWithEmailAndPassword(email,password)
       .catch((error) => alert(error.message))
       setOpenSignIn(false);
   }
  //------------------
  return (
    <div className="App">
      <Modal           // modal for sign up initially hide but after button clicked its visible
        open={open}
        onClose = {() => setOpen(false)}
        >
          <div style={modalstyle} className={classes.paper}>
            <form className="app__form">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                />
              </center>
              <Input
                placeholder="UserName"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSignUp}>Sign Up</button>
              </form>
          </div>
      </Modal>

      <Modal                // modal for sign in initially hide but after button clicked its visible
        open={openSignIn}
        onClose = {() => setOpenSignIn(false)}
        >
          <div style={modalstyle} className={classes.paper}>
            <form className="app__form">
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSignin}>Sign in</button>
              </form>
          </div>
      </Modal>
                                      
    <div className="app__header">                                       
          <a href="./App.js"><img
            className="appheader__image"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"          
           /></a>   
              {user ? (
                <Button  onClick={() => auth.signOut()}>log out</Button>
              ):(
                <div className="app__signupin">
                <Button  onClick={() => setOpenSignIn(true)}>Sign in</Button>
                <Button  onClick={() => setOpen(true)}>Sign up</Button>
                </div>
             )
    }
    </div>  
    <div className="add__body">
    <div className="app__posts">
     {posts.map(({id,post}) => (
       <Post key={id} postId={id} user={user} username={post.username.username} caption={post.caption} imageUrl={post.imageUrl} />
     ))}
     </div>
     </div>
     {user?.displayName ? (
      <ImageUpload username = {user.displayName} />
    ): (
      <h3>you need to login</h3>
    )}
    </div>
  );
}

export default App;
