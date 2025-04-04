import ChatContainer from "./components/ChatContainer"
import UsersPanel from "./components/UsersPanel"
import "./assets/App.css"
import { useEffect, useState } from "react"
import supabase from "../supabaseClient"
import { BsGoogle } from "react-icons/bs";
import { IconContext } from 'react-icons/lib';
import SignUp from "./components/SignUp"
import LogIn from "./components/LogIn"
import axios from 'axios';

const App = () => {
  const [isChatContainerOpen, setIsChatContainerOpen] = useState(true);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const [session, setSession] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [encDecData, setEncDecData] = useState('');
  const [selectedUser, setSelectedUser] = useState('public');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();


  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      axios.get('https://realtime-chatapp-bu6c.onrender.com/get-all-users')
        .then((res) => { setAllUsers(res.data.users) })
        .catch((err) => { console.log(err) });
    }
    fetchUsers();
  }, [])

  useEffect(() => {
    fetchMessages();
    supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Messages',
        },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe()
  }, [])

  useEffect(() => {
    document.querySelector('.chatcontainer-sec').style.zIndex = isChatContainerOpen ? "1" : "-1";
  }, [isChatContainerOpen])

  // sign in
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
  const signInWithEmail = async (email) => {
    await supabase.auth.signInWithEmail({
      email
    });
  };
  // sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  //fetch messages
  const fetchMessages = async () => {
    axios.get('https://realtime-chatapp-bu6c.onrender.com/get-all-messages')
      .then(res => setMessages(res.data))
      .catch(err => console.log(err))
  }

  //encrypt-decrypt message
  const codeDecodeMessage = async (message, key) => {
    const response = await axios.post('https://realtime-chatapp-bu6c.onrender.com/code-decode', {
      message,
      key
    })
    return response.data;
  }
  //add message
  const addMessage = async (e) => {

    await e.preventDefault();

    if (newMessage === '') {
      return
    }
    let date = new Date();
    let hour = date.toLocaleTimeString([], { hour: "2-digit" }).substring(0, 2);
    let min = date.toLocaleTimeString([], { minute: "2-digit" }).substring(0, 2);
    let sec = date.toLocaleTimeString([], { second: "2-digit" }).substring(0, 2);
    let encryptedData = await codeDecodeMessage(newMessage, sec+min+hour);

    await supabase
      .from('Messages')
      .insert([
        { sender: session.user.email, message: await encryptedData, to: selectedUser, time: sec + min + hour }
      ]);

    await fetchMessages();
    setNewMessage('');
    document.querySelector('.msgbox').value = '';
  }




  if (!session) {
    return (
      <div className='d-flex justify-content-center align-items-center text-light' style={{ height: "100vh", width: "100%", background: '#212529' }}>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-8 col-lg-4">
            <SignUp />
          </div>
          <div className="col-8 col-lg-4">
            <LogIn />
          </div>
          <div className='col-8 d-flex justify-content-center'>
            <button className='col-8 btn btn-info px-4 py-3 d-flex justify-content-center align-items-center' onClick={signInWithGoogle}><IconContext.Provider value={{ size: "1.2em", className: "me-3" }}><BsGoogle /></IconContext.Provider>Continue with Google</button>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="d-flex flex-row" style={{ position: "relative", overflowY: "hidden", height: "100vh" }}>
        <UsersPanel setIsChatContainerOpen={setIsChatContainerOpen} allUsers={allUsers} setSelectedUser={setSelectedUser} signOut={signOut} session={session} />
        <ChatContainer setIsChatContainerOpen={setIsChatContainerOpen} messages={messages} isSmallDevice={isSmallDevice} setIsSmallDevice={setIsSmallDevice} addMessage={addMessage} setNewMessage={setNewMessage} session={session} selectedUser={selectedUser} />
      </div>
    )
  }
}

export default App