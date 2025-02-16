import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDisclosure } from '@mantine/hooks';
import { ScrollArea } from '@mantine/core';
import { useWebSocketContext } from '../../components/websockets';

function LobbyRoom() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const auth = useAuthUser();
  // const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [readyPlayer, setReadyPlayer] = useState(false);
  const [avatar, setAvatar] = useState('images/avatar.png');

  const value = useWebSocketContext();
  console.log(value);
  useEffect(() => {
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  useEffect(() => {
    if (value.readyState === 1) {
      // WebSocket is open, we can send messages
      value.sendJsonMessage({
        event: 'enter lobby',
        data: {
          channel: 'lobby',
          name: auth.name,
        },
      });
    } else if (value.readyState === 3) {
      console.log('WebSocket is closed, reconnecting...');
      // Handle reconnection logic here if needed
    }
  }, [value.readyState, value.sendJsonMessage, auth.name]);

  useEffect(() => {
    if (value.lastJsonMessage) {
      console.log('New message received: ', value.lastJsonMessage);

      if (value.lastJsonMessage.type == 'readyPlayers') {
        const allReadyPlayers = value.lastJsonMessage.readyPlayers || [];
        setReadyPlayers(allReadyPlayers);
      }

      if (value.lastJsonMessage.type === 'allPlayersUpdate') {
        const allPlayersList = value.lastJsonMessage.players || [];
        setAllPlayers(allPlayersList);
      }

      if (value.lastJsonMessage.type === 'playerUpdate') {
        const playersInLobby = value.lastJsonMessage.players || [];
        setLobbyPlayers(playersInLobby);

        const playerNamesPromises = playersInLobby.map((token) => {
          if (typeof token !== 'string') {
            console.error('Invalid token:', token);
            return Promise.resolve(null);
          }
          try {
            const decoded = jwtDecode(token);
            return decoded.sub;
          } catch (error) {
            console.error('Error decoding JWT: ', error);
            return null;
          }
        });

        Promise.all(playerNamesPromises)
          .then((playerNames) => {
            const filteredNames = playerNames.filter((name) => name !== null);
            setLobbyPlayers(filteredNames);
          })
          .catch((err) => console.error('Error processing player names: ', err));
      }
    }
  }, [value.lastJsonMessage]);

  useEffect(() => {
    if (!auth) {
      navigate('/auth');
      console.log('User is not logged in.');
    } else {
      console.log('User is logged in.');
    }
  }, [auth, navigate]);

  if (!auth) return null;

  const handleReadyClick = () => {
    setReadyPlayer(!readyPlayer);
    value.sendJsonMessage({
      event: 'player ready',
      data: {
        name: auth.name,
        ready: !readyPlayer,
      },
    });
  };

  return (
    // <WebSocketProvider>
    <main className={styles.background}>
      <div className={styles.centerMultiplayer}>
        <div className={styles.leftLobby}>
          <Link to='/menu'>
            <button className={styles.exitButtonLobby}>
              <img src='video/exist.gif' className={styles.exitGifLobby} alt='Exit' />
            </button>
          </Link>
        </div>
        <div className={styles.containerMultiplayer}>
          <div className={styles.containerList}>
            <div className={styles.containerProfile}></div>
            <div className={styles.boxProfile}>
              <div className={styles.playerAvatar}>
                <img src={avatar} alt='Player Avatar' className={styles.playerAvatarImg} />
              </div>
              <div className={styles.playerInfo}>
                <div className={styles.playerName}>{auth.name}</div>
                <div className={styles.playerStats}>
                  {/* Total wins: 0<br />
                  Score: 0 */}
                </div>
              </div>
            </div>

            <div className={styles.playerList}>
              All Players:
              <ScrollArea.Autosize mah={650} maw={400} mx='auto'>
                {allPlayers.length > 0 ? (
                  allPlayers.map((player, index) => (
                    <div key={index} className={styles.playerStats}>
                      <div className={styles.playerCardOnline}>
                        <div className={styles.iconContainer}>
                          <img
                            src={avatar}
                            className={styles.playerProfileImg}
                            alt='Player Profile'
                          />
                          <div
                            className={
                              player.online ? styles.statusCircleOnline : styles.statusCircleOffline
                            }
                          ></div>
                        </div>
                        {player.username}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.playerCard}>No players connected</div>
                )}
              </ScrollArea.Autosize>
            </div>
          </div>
          <div className={styles.titleBox}>
            <div className={styles.multiplayerTitle}>Create room</div>
            <div className={styles.playerLobby}>
              <div className={styles.containerPlayerLb}>
                {lobbyPlayers.length > 0 ? (
                  lobbyPlayers.map((player, index) => (
                    <div key={index} className={styles.playerStats}>
                      <div className={styles.playerCard}>
                        <strong className={styles.statisticsContainer}>
                          <img
                            src={avatar}
                            className={styles.playerProfileImg}
                            alt='Player Profile'
                          />
                          {player}
                          {readyPlayers.length >= 1 &&
                          readyPlayers.some((state) => state === player) ? (
                            <span className={styles.readyText}> (Ready)</span>
                          ) : (
                            <span className={styles.readyText}></span>
                          )}
                        </strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.playerCard}>No players connected</div>
                )}
              </div>
              <div>
                <button onClick={handleReadyClick} className={styles.playButton}>
                  {readyPlayer ? 'Unready' : 'Ready'}
                </button>

                {lobbyPlayers.length >= 2 ? (
                  readyPlayers.length === lobbyPlayers.length && (
                    <button
                      onClick={() => {
                        open;
                        navigate('/multiplayer');
                      }}
                      className={styles.playButton}
                      disabled={
                        readyPlayers.length !== lobbyPlayers.length || lobbyPlayers.length < 2
                      }
                    >
                      Start Game
                    </button>
                  )
                ) : (
                  <button onClick={close} className={styles.playButton}>
                    Waiting for players...
                  </button>
                )}
              </div>

              {/* <div>
                <Modal
                  open={open}
                  opened={opened}
                  onClose={close}
                  title='Multiplayer game'
                  fullScreen
                  radius={0}
                  transitionProps={{ transition: 'fade', duration: 200 }}
                  styles={{
                    body: {
                      backgroundImage: 'url(/images/bg.png)',
                      width: '100%',
                      height: '100%',
                      maxHeight: '94vh',
                    },
                    modal: {
                      color: 'white',
                      padding: '20px',
                    },
                    header: {
                      backgroundColor: '#ccc', // Optional: Change header background color
                    },
                  }}
                >
                  <MultiPly players={lobbyPlayers} />
                </Modal>

                <button onClick={handleReadyClick} className={styles.playButton}>
                  {readyPlayer ? 'Unready' : 'Ready'}
                </button>
                {readyPlayers.size == lobbyPlayers.length && (
                  <button
                    onClick={() => {
                      open;
                      navigate('/menu');
                    }}
                    className={styles.playButton}
                    disabled={
                      readyPlayers.length !== lobbyPlayers.length || lobbyPlayers.length < 2
                    }
                  >
                    Start Game
                  </button>
                )}
                {lobbyPlayers.length >= 2 ? (
                  readyPlayers.length === lobbyPlayers.length && (
                    <button
                      onClick={() => {
                        open;
                        navigate('/menu');
                      }}
                      className={styles.playButton}
                      disabled={
                        readyPlayers.length !== lobbyPlayers.length || lobbyPlayers.length < 2
                      }
                    >
                      Start Game
                    </button>
                  )
                ) : (
                  <button onClick={close} className={styles.playButton}>
                    Waiting for players...
                  </button>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
    // </WebSocketProvider>
  );
}

export default LobbyRoom;
