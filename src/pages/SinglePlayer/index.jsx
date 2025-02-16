import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Text } from '@mantine/core';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect } from 'react';
import styles from './index.module.css';

const actions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export function Bot() {
  const keys = Object.keys(actions);
  const index = Math.floor(Math.random() * keys.length);
  return keys[index];
}

export function Calculatewinner(action1, action2) {
  if (action1 === action2) {
    return 0;
  } else if (actions[action1] === action2) {
    return -1;
  } else if (actions[action2] === action1) {
    return 1;
  }
  return null;
}
export function Scissors() {
  return <img src='./images/scissors.png' className={styles.scissors} />;
}
export function Rock() {
  return <img src='./images/rock.png' className={styles.rock} />;
}
export function Paper() {
  return <img src='./images/paper.png' className={styles.paper} />;
}
export function Actionicon({ action, ...props }) {
  const icons = {
    rock: Rock,
    paper: Paper,
    scissors: Scissors,
  };
  const Icon = icons[action];

  return <Icon {...props} />;
}
export function Player({ name = 'Player', score = 0, action = 'rock' }) {
  return (
    <main className={styles.playerSingle}>
      <div className={styles.scoreSingle}>{`${name}: ${score}`}</div>
      <div className={styles.actionSingle}>
        {action && <Actionicon action={action} size={300} />}
      </div>
    </main>
  );
}

export function Actionbutton({ action = 'rock', onActionSelected }) {
  return (
    <button className={styles.roundBtn} onClick={() => onActionSelected(action)}>
      <Actionicon action={action} size={50} />
    </button>
  );
}

export function Showwinner({ winner = 0 }) {
  const text = {
    '-1': 'You win!',
    0: "It's a tie!",
    1: 'You lose!',
  };
  return <h2>{text[winner]}</h2>;
}
export function Winnermessage({ finalScoreP, finalScoreC }) {
  const navigate = useNavigate();
  const [totalWins, setTotalWins] = useState(0);
  console.log(`You have won ${totalWins} times`);

  return (
    <>
      {finalScoreP > finalScoreC ? (
        <main className={styles.backgroundRoundM}>
          <img src='video/confetti.gif' className={styles.confettiGif} />
          <div className={styles.winBox}>
            <h2 className={styles.h2}>You win!</h2>
            <h3 className={styles.h3}>Player: {finalScoreP} points</h3>
            <h3 className={styles.h3}>Bot: {finalScoreC} points</h3>
            <button
              className={styles.winButton}
              onClick={() => {
                setTotalWins(totalWins + 1);
                navigate('/menu');
              }}
            >
              exit
            </button>
          </div>
        </main>
      ) : (
        <main className={styles.backgroundRoundM}>
          <div className={styles.winBox}>
            <h2 className={styles.h2}>You lose!</h2>
            <h3 className={styles.h3}>Player: {finalScoreP} points</h3>
            <h3 className={styles.h3}>Bot: {finalScoreC} points</h3>
            <button
              className={styles.winButton}
              onClick={() => {
                navigate('/menu');
              }}
            >
              exit
            </button>
          </div>
          <img src='video/rain.gif' className={styles.rainGif} />
        </main>
      )}
    </>
  );
}
export function Roundmessage({ round }) {
  const [showMessage, setShowMessage] = useState(true);
  useEffect(() => {
    setShowMessage(true);
    function wait(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      });
    }

    async function Dissapear() {
      await wait(1000); // Wait for 2000 milliseconds (2 seconds)
      setShowMessage(false);
    }

    Dissapear();
  }, [round]);
  return (
    <>
      {showMessage ? (
        <main className={styles.backgroundRoundM}>
          <h2 className={styles.roundText}>Round {round}</h2>
        </main>
      ) : null}
    </>
  );
}

function Singleplayer() {
  // const authHeader = useAuthHeader();
  const [playerAction, setPlayerAction] = useState('');
  const [computerAction, setComputerAction] = useState('');

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [finalScoreP, setFinalScoreP] = useState(0);
  const [finalScoreC, setFinalScoreC] = useState(0);

  const [winner, setWinner] = useState(0);

  const [moves, setMoves] = useState(1);
  const [round, setRounds] = useState(1);

  const onActionSelected = (selectedAction) => {
    const newComputerAction = Bot();
    setMoves(moves + 1);
    // if (moves == 3) {
    //   setMoves(1);
    //   setRounds(round + 1);
    //   setComputerScore(0);
    //   setPlayerScore(0);
    //   Roundmessage(round);
    // }
    setPlayerAction(selectedAction);
    setComputerAction(newComputerAction);
    const newWinner = Calculatewinner(selectedAction, newComputerAction);
    setWinner(newWinner);
    if (round == 5) {
      Winnermessage(finalScoreC, finalScoreP);
      // sendData(authHeader, finalScoreC);
    } else if (newWinner === -1) {
      setPlayerScore(playerScore + 2);
      setComputerScore(computerScore + 0);
    } else if (newWinner === 1) {
      setComputerScore(computerScore + 2);
      setPlayerScore(playerScore + 0);
    }

    setFinalScoreP(finalScoreP + playerScore);
    setFinalScoreC(finalScoreC + computerScore);
    console.log(finalScoreC);
    console.log(finalScoreP);
    if (moves == 3) {
      setMoves(1);
      setRounds(round + 1);
      setComputerScore(0);
      setPlayerScore(0);
      Roundmessage(round);
    }
  };

  const [opened, { close, open }] = useDisclosure(false);

  const navigate = useNavigate();
  const auth = useAuthUser();
  console.log(auth);

  useEffect(() => {
    if (!auth) {
      navigate('/auth');
      console.log('User is not logged in.');
    } else {
      console.log('User is logged in.');
    }
  }, [auth]);
  if (!auth) return;

  return (
    <main className={styles.backgroundSingle}>
      <>
        <Modal
          opened={opened}
          onClose={close}
          size='auto'
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          styles={{
            content: { backgroundColor: 'gray' },
            header: { backgroundColor: 'gray' },
          }}
          centered
        >
          <Text color='white' size='xl'>
            Are you sure you want to exit?
          </Text>

          <Group mt='xl'>
            <Link to='/menu'>
              <Button color='orange'>Yes</Button>
            </Link>
            <Button color='orange' onClick={close}>
              No
            </Button>
          </Group>
        </Modal>
      </>
      <div className={styles.centerSingle}>
        <h1>Rock Paper Scissors ________________________ Round {round}</h1>
        <div className={styles.left}>
          <button onClick={open} className={styles.exitButton}>
            <img src='video/exist.gif' className={styles.exitGif} />
          </button>
        </div>
        {/* name={auth.name} */}
        <div className={styles.containerSingle}>
          <Player score={playerScore} action={playerAction} />
          <Player name='Bot' score={computerScore} action={computerAction} />
        </div>
        <div>
          <Actionbutton action='rock' onActionSelected={onActionSelected} />
          <Actionbutton action='paper' onActionSelected={onActionSelected} />
          <Actionbutton action='scissors' onActionSelected={onActionSelected} />
        </div>
        {/* <Showwinner winner={winner} /> */}
      </div>
      <Roundmessage round={round} moves={moves} />
      {round === 5 && <Winnermessage finalScoreP={finalScoreP} finalScoreC={finalScoreC} />}
    </main>
  );
}

export default Singleplayer;
