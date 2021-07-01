import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import logoImg from '../assets/images/logo.svg';
import emptyImg from '../assets/images/empty-room.svg';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { useTheme } from '../hooks/useTheme';
import { Toggle } from '../components/Toggle/index';
import logoDarkImg from '../assets/images/logo-dark.svg';

type RoomType = {
  roomId: string,
  title: string,
  roomIsOpen?: boolean;
}[]

export function RoomList() {
  const history = useHistory();
  const [ rooms, setRooms ] = useState<RoomType>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    const dbRef = database.ref(`rooms`);
    dbRef.once('value', rooms => {
      const dbRoom: object = rooms.val() ?? {};
      const parsedRooms = Object.entries(dbRoom).map(([ key, value ]) => {
        return {
          roomId: key,
          title: value.title,
          roomIsOpen: value.roomIsOpen
        }
      });

      setRooms(parsedRooms);
      setIsLoading(false);
    });
  }, []);

  function handleGoHomePage() {
    return history.push('/');
  }

  function handleGoToRoom(questionId: string, isOpen: boolean) {
    if(isOpen) {
      return history.push(`rooms/${questionId}`);
    } else {
      return window.alert('A sala já fechou!');
    }
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" onClick={handleGoHomePage} />
          <div>
            <Toggle />
          </div>
        </div>
      </header>
      <main className="content">
        <div className="question-list">
          <div className="room-box-div">
            { rooms.length !== 0 && isLoading === false ? rooms.map((item: any) => {
              return (
                <div 
                  className={`room-item-div ${item.roomIsOpen ? '' : 'closed'}`} 
                  onClick={() => handleGoToRoom(item.roomId, item?.roomIsOpen)} key={item.roomId}
                >
                  {item.title}
                </div>)}) 
                : (
                  <div className="empty-list">
                    <h1>Não temos salas no momento</h1>
                    <img src={emptyImg} alt="Emptyroom" />
                  </div>
                )}
          </div>
        </div>
      </main>
    </div>
  )
}