import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);



function App() {


const [user,setUser] = useState({
  isSignedIn:false,
  name:'',
  email:'',
  photo:''
})

  const provider = new firebase.auth.GoogleAuthProvider();

 const handleSignIn= () =>{
  //  console.log('Cllik');
 firebase.auth().signInWithPopup(provider)
.then (res=>{
const {displayName,photoURL,email} = res.user;
const signedUser = {
isSignedIn : true,
name: displayName,
email:email,
photo: photoURL
}
setUser(signedUser)

  console.log(displayName,photoURL,email);

})
.catch(err => {
  console.log(err);
})
}
const handleSignOut = () => {
firebase.auth().signOut()
.then(res =>{
const signedOutUser ={
  isSignedIn: false,

   name:'',
   email:'',
   photo:''


}
setUser(signedOutUser);
  // console.log(res);
})
.catch(err =>{


})

}

  return (
    <div className="App">
{  
user.isSignedIn ? <button onClick={handleSignOut}>Sign out </button>
:
<button onClick={handleSignIn}>Sign in </button>
}
  {
    user.isSignedIn && <div>
<p>Welcome : {user.name}</p>
<h6>email:{user.email}</h6>
<img src={user.photo} alt="" />
    </div>
  }
    </div>
  );
}

export default App;
