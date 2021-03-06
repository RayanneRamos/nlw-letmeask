import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';

import { Button } from '../../components/Button/index';
import { Toggle } from '../../components/Toggle';

import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

import '../../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [ newRoom, setNewRoom ] = useState('');
  const history = useHistory();
  const { theme } = useTheme();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    
    if(newRoom.trim() === '') {
      toast.error("Nome da sala está vazio!");
      return;
    }

    if(!user) {
      toast.error("Você precisa estar logado para criar uma sala!");
      return;
    }
    
    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      roomIsOpen: true,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="main-content">
          <div className="toggle">
            <Toggle />
          </div>
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          {user && (
            <div className="info-user">
              <img src={user?.avatar} alt={user?.name} />
            </div>
          )}
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}