import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';

import { Button } from '../../components/Button/index';
import { Toggle } from '../../components/Toggle';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

import { database } from '../../services/firebase';

import '../../styles/auth.scss';
 
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
      toast.error("Campo está vazio!");
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      toast.error("Está sala não existe!");
      return;
    }

    if(roomRef.val().endedAt) {
      toast.error("A sala está fechada.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
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
              <Button type="submit">
                Entrar na sala
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}