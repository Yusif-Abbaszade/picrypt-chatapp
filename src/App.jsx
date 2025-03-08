
import React, { useEffect, useState } from 'react'
import { supabase, supabaseAdmin } from '../supabaseClient';
import { BsGoogle } from "react-icons/bs";
import { IconContext } from 'react-icons/lib';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

const App = () => {
  const [session, setSession] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
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
      const { data } = await supabaseAdmin.auth.admin.listUsers();
      setAllUsers(data.users);
    }
    fetchUsers();
  }, [])


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
    const { data } = await supabase.from('Messages').select('*');

    if (data) {
      setMessages(data);
    }
  }


  //add message
  const addMessage = async (e) => {
    
    await e.preventDefault();
    if (newMessage === '') {
      return
    }
    await supabase
      .from('Messages')
      .insert([
        { sender: session.user.email, message: newMessage, to: selectedUser },
      ]);

    await fetchMessages();
    setNewMessage('');
    document.querySelector('.msgbox').value = '';
  }

  const setSelectedClass = (id) => {
    const allUsers = document.querySelectorAll('.all-users div');
    allUsers.forEach((user) => {
      user.classList.remove('selected');
    })
    document.getElementById(id).classList.add('selected');
  }

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
    if(session){
      document.querySelector('.all-messages').scrollTop = document.querySelector('.all-messages').scrollHeight;
    }
  }, [messages])

  if (!session) {
    return (
      <div className='d-flex justify-content-center align-items-center text-light' style={{ height: "100vh", width: "100%" }}>
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
  }
  else {
    return (

      <div>
        <button onClick={signOut} className='btn btn-danger fs-2'>Sign out</button>
        <h3 className='text-light'>Welcome {session?.user?.email}</h3>

        <div className="messages-box text-light row m-0 d-flex justify-content-center">
          <div className="col-12 col-md-4 col-xl-3" style={{ height: "80vh", overflowY: "scroll", background: "#021526" }}>
            <div className="users-list">
              <h4>Users</h4>
              <div className='all-users list-unstyled'>
                <div onClick={()=>{setSelectedUser('public'); setSelectedClass('publicchatsecbtn')}} id='publicchatsecbtn' className='ps-2 d-flex my-2 align-items-center rounded-5 selected' style={{ height: "50px", width: "100%", background: "#03346E" }}>Public</div>
                {allUsers.map((user, index) => (
                  <div id={user.id} onClick={()=>{setSelectedUser(user.email); setSelectedClass(user.id);}} className='d-flex my-2 align-items-center rounded-5' style={{ height: "50px", width: "100%", background: "#03346E" }} key={index}>
                    <p className='ps-2'>{user.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-7 col-xl-8 msgsec" style={{ height: "80vh", background: "#021526" }}>
            <div className="messages">
              <h4>Messages</h4>
              <div className='all-messages' style={{ height: "70vh", overflowY: "scroll" }}>
                {messages.filter(item=>(item.sender === session.user.email && item.to === selectedUser) || (item.sender === selectedUser && item.to === session.user.email) || (item.to === 'public' && selectedUser==='public')).map((message, index) => (
                  <div className={`d-flex my-2 align-items-center py-1 rounded-5 ${message.sender===session.user.email?"selected":""}`} style={{ width: "100%", background: "#03346E" }} key={index}>
                    <p className='ps-2'>{message.sender} : {message.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <form action="" className='sendmsgform' onSubmit={addMessage}>
              <input type="text" className='msgbox' onChange={(e) => { setNewMessage(e.target.value); }} />
              <button type='submit' className='btn btn-dark'>Send</button>
            </form>
          </div>
        </div>


      </div>
    )
  }
}

export default App