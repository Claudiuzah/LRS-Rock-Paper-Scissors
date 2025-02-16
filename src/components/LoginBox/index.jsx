import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { API_SELF, LOGIN } from '../constants.js';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import styles from './index.module.css';

const signInUser = async (username, password) => {
  const response = await fetch(`${API_SELF}${LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=password&clientId=my-trusted-client&username=${username}&password=${password}&scope=user_info`,
  });
  if (!response.ok) console.log('error');

  return await response.json();
};

function Loginbox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const signIn = useSignIn();

  const navigate = useNavigate();

  async function logging() {
    console.log('test');
    const data = await signInUser(username, password);
    console.log(data);
    if (data) {
      signIn({
        auth: {
          token: data.access_token,
          type: 'bearer',
        },
        userState: {
          name: data.user_data.username,
          id: data.user_data.id,
        },
      });

      navigate('/menu');
    } else {
      navigate('/auth');
    }
  }

  const handleKeyDownUsername = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      passwordRef.current.focus();
    }
  };

  const handleKeyDownPassword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      logging();
    }
  };

  return (
    <>
      <div>
        <div className={styles.logInBox}>
          <div className={styles.logInBoxContent}>
            <div className={styles.logInContenth2}>
              <h2>Log In</h2>
            </div>

            <div className={styles.logInForm}>
              <div className={styles.logInInputBox}>
                <input
                  type='text'
                  required
                  value={username}
                  className={styles.logInInput}
                  onChange={(event) => setUsername(event.target.value)}
                  onKeyDown={handleKeyDownUsername}
                />
                <i className={styles.logIni}>username</i>
              </div>

              <div className={styles.logInInputBox}>
                <input
                  type='password'
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={styles.logInInput}
                  ref={passwordRef}
                  onKeyDown={handleKeyDownPassword}
                />
                <i className={styles.logIni}>password</i>
              </div>

              <div className={styles.logInLinks}>
                <a>You dont have an account?</a>
                <Link to='/register' className={styles.logInLinks2}>
                  Signup
                </Link>
              </div>

              <div className={styles.logInInputBox}>
                <input
                  type='submit'
                  value='Login'
                  onClick={logging}
                  className={styles.buttonLogIn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Loginbox;
