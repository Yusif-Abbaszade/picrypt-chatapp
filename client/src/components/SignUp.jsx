import React, { useState } from 'react';  
import supabase from '../../supabaseClient.js'; // Import your Supabase client  

function SignUp() {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  

  const handleSignUp = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setError(null);  

    try {  
      const { data, error } = await supabase.auth.signUp({  
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
      <h2>Sign Up</h2>  
      {error && <p style={{ color: 'red' }}>{error}</p>}  
      <form onSubmit={handleSignUp} className='w-100'>  
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
        <button type="submit" className='btn btn-success text-dark' disabled={loading}>  
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>  
    </div>  
  );  
}  

export default SignUp;  