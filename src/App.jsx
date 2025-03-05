
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import { BsGoogle } from "react-icons/bs";
import { IconContext } from 'react-icons/lib';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

const App = () => {
  const [session, setSession] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
    await supabase
      .from('Messages')
      .insert([
        { sender: session.user.email, message: newMessage, to: 'public' },
      ]);

    await fetchMessages();
    setNewMessage('');
    document.querySelector('.msgbox').value = '';
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
        <ul className='text-light'>
          {messages.map((message, index) => (
            <li key={index}>
              <p>{message.sender} : {message.message}</p>
            </li>
          ))}
        </ul>
        <form action="" onSubmit={addMessage}>
          <input type="text" className='msgbox' onChange={(e) => { setNewMessage(e.target.value); }} />
          <button type='submit'>Send</button>
        </form>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }
}

export default App