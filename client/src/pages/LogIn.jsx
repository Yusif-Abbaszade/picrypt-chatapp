import React, { useState } from 'react';  
import supabase from '../../supabaseClient';  

function SignIn() {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  

  const handleSignIn = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setError(null);  

    try {  
      const { data, error } = await supabase.auth.signInWithPassword({  
        email: email,  
        password: password,  
      });  

      if (error) {  
        setError(error.message);  
      }  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setLoading(false);  
    }  
  };  

  return (  
    <div>  
      <h2>Sign In</h2>  
      {error && <p style={{ color: 'red' }}>{error}</p>}  
      <form onSubmit={handleSignIn}>  
        <div>  
          <label htmlFor="email">Email:</label>  
          <input  
            type="email" 
            className='w-100 ps-2'
            style={{height:"4vh"}}  
            id="email"  
            value={email}  
            onChange={(e) => setEmail(e.target.value)}  
            required  
          />  
        </div>  
        <div>  
          <label htmlFor="password">Password:</label>  
          <input  
            type="password"  
            className='w-100 ps-2'
            style={{height:"4vh"}} 
            id="password"  
            value={password}  
            onChange={(e) => setPassword(e.target.value)}  
            required  
          />  
        </div>  
        <button className='btn btn-warning text-dark' style={{float:"right"}} type="submit" disabled={loading}>  
          {loading ? 'Signing In...' : 'Sign In'}  
        </button>  
      </form>  
    </div>  
  );  
}  

export default SignIn;  