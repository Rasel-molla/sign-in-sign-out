
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

   

function App() {

const [newUser,setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password:'',
    photo: '',
    error: ''
  }) 

  const googleProvider = new firebase.auth.GoogleAuthProvider();
const  fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {

    firebase.auth().signInWithPopup(googleProvider)
      .then(res => { 
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)

        // console.log(displayName, photoURL, email);

      })
      .catch(err => {
        console.log(err);
      })
  }

const handleFbSignIn = () => {
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

}

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,

          name: '',
          email: '',
          password: '',
          photo: '',
          error:'',
          success:false


        }
        setUser(signedOutUser);
        // console.log(res);
      })
      .catch(err => {


      })

  }
  const handleBlur = (event) => {

    let isFieldValid = true;

    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid);

    }
    if (event.target.name === 'password') {
      const isPassWordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);

      isFieldValid = isPassWordValid && passwordHasNumber;

    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
    // console.log(event.target.name, event.target.value);
  }
  const handleSubmit = (event) => {
  // console.log(user.email,user.password)

if( newUser && user.email && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email,user. password)
  .then( res => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success =true;
      setUser(newUserInfo);
      updateUserName (user.name);
    // Signed in 
    // var user = userCredential.user;
    // ...
  })
  .catch( error => {
    const newUserInfo = {...user};
    newUserInfo.success =false;
    newUserInfo.error = error.message;
  setUser(newUserInfo);
    // ..
  });

if (!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success =true;
setUser(newUserInfo);
    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.success =false;
    newUserInfo.error = error.message;
  setUser(newUserInfo);
  });

}

}
event.preventDefault();

  }
const updateUserName = name => {

 const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
  // photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  // Update successful.
  console.log('oky all thik ')
}).catch(function(error) {
  console.log(error)
  // An error happened.
});

}
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out </button>
          :
          <button onClick={handleSignIn}>Sign in </button>
      }
      <br/>
<button onClick={handleFbSignIn}>
  Sign in Using Facebook
</button>

      {
        user.isSignedIn && <div>
          <p>Welcome : {user.name}</p>
          <h6>email:{user.email}</h6>
          <img src={user.photo} alt="" />
        </div>
      }
      {/* name or email */}

 

      <h1>Our Own AuthentiCation</h1>
   <input type="checkbox" onChange={() => setNewUser (!newUser) } name="Naw User" />
   <label htmlFor="newUser"> New User Sign Up </label>

       {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}


      <form onSubmit={handleSubmit}>
      {newUser &&   <input type="text" onBlur={handleBlur} placeholder=" Your Name" required />}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email " required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password"  required />
        <br />
        <input type="submit" value={ newUser ? 'Sign up' : 'Sign In'} />
      </form>
<p style={{color:'red'}}>  {user.error} </p>   
{user.success && <p style={{color:'green'}}> User { newUser ? 'created' : 'Logged In'} Successfully  </p>}
    </div>
  );
}

export default App;
