import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { AUTHENTICATE, API_SELF } from '../constants';
import styles from './index.module.css';

async function postUser(username, password) {
  const body = {
    username,
    password,
  };
  const response = await fetch(`${API_SELF}${AUTHENTICATE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
}

function Signupbox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const signupButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    const data = await postUser(username, password);
    if (data) {
      navigate('/auth');
    } else {
      navigate('/register');
    }
  };

  const handleKeyDownUsername = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      passwordRef.current.focus();
    }
  };

  const handleKeyDownPassword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      signupButtonRef.current.click();
    }
  };

  return (
    <main>
      <div className={styles.logInBox}>
        <div className={styles.logInBoxContent}>
          <div className={styles.logInContenth2}>
            <h2>Sign up</h2>
          </div>

          <div className={styles.logInForm}>
            <div className={styles.logInputBox}>
              <input
                type='text'
                required
                value={username}
                onChange={handleInputChange}
                onKeyDown={handleKeyDownUsername} // Mută focus-ul la Enter
                className={styles.logInInput}
              />
              <i className={styles.logIni}>username</i>
            </div>

            <div className={styles.logInInputBox}>
              <input
                type='password'
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={handleKeyDownPassword} // Execută signup la Enter
                className={styles.logInInput}
                ref={passwordRef} // Referință la câmpul de password
              />
              <i className={styles.logIni}>password</i>
            </div>

            <div className={styles.logInLinks}>
              <a>You have an account?</a>
              <Link to='/auth' className={styles.signUpLinks2}>
                Log in
              </Link>
            </div>

            <div className={styles.logInInputBox}>
              <input
                type='submit'
                value='Signup'
                onClick={handleSignUp}
                className={styles.buttonLogIn}
                ref={signupButtonRef} // Referință la butonul de Signup
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signupbox;
