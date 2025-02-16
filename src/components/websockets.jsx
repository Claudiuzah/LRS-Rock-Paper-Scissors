import useWebSocket from 'react-use-websocket';
import { WS_URL } from '../components/constants';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { createContext, useContext } from 'react';
import LobbyRoom from '../pages/Lobby';
import MultiPlayer from '../pages/MultiPlayer';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect, useState } from 'react';
import Loginbox from './LoginBox';
import Signupbox from './SignUpBox';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const authHeader = useAuthHeader();
  const auth = useAuthUser();
  const [socketUrl, setSocketUrl] = useState('');

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: () => true,
    onClose: (event) => {
      console.log('WebSocket closed: ', event);
    },
  });

  useEffect(() => {
    if (!auth) {
      console.log('User is not logged in. Redirecting to login page...');
      // navigate('/auth');
      return;
    }

    if (authHeader) {
      const token = authHeader.slice(7);
      setSocketUrl(`${WS_URL}/ws/${token}`);
    } else {
      console.log('No authHeader available.');
    }
  }, [auth, authHeader]);

  if (!auth || !socketUrl) return null;

  const value = {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => useContext(WebSocketContext);

function App() {
  return (
    <WebSocketProvider>
      <LobbyRoom />
      <MultiPlayer />
      <Loginbox />
      <Signupbox />
    </WebSocketProvider>
  );
}

export default App;
