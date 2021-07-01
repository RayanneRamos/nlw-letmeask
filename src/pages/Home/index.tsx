import { useHistory } from 'react-router-dom';
import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button/index';
import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../../services/firebase';
import logoDarkImg from '../../assets/images/logo-dark.svg';
import { Toggle } from '../../components/Toggle';
import { useTheme } from '../../hooks/useTheme';
 
export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');
  const { theme } = useTheme();

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  function handleGoToRoomList() {
    return history.push(`roomlist`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <div className="toggle">
            <Toggle />
          </div>
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o google
          </button>
          <div className="separator">ou entre em um sala</div>
          <form onSubmit={handleJoinRoom}>
            <div>
              <input 
                  type="text"
                  placeholder="Digite o código da sala"
                  onChange={event => setRoomCode(event.target.value)}
                  value={roomCode}
              />
              <Button type="submit">Entrar na sala</Button>
            </div>
            <Button onClick={handleGoToRoomList}>Lista de salas</Button>  
          </form>
        </div>
      </main>
    </div>
  );
}