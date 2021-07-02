import { useHistory, useParams, Link } from 'react-router-dom';
import { useState } from 'react';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../../components/Button/index';
import { EmptyQuestion } from '../../components/EmptyQuestion';
import { CardQuestion } from '../../components/CardQuestion';
import { RoomCode } from '../../components/RoomCode/index';
import { Modal } from '../../components/Modal/index';
import { Toggle } from '../../components/Toggle/index';

import { useRoom } from '../../hooks/useRoom';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

import '../AdminRoom/style.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom () {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  const { questions, title, dataRoom } = useRoom(roomId);
  const questionsQuantity = questions.length;
  const [ isOpen, setIsOpen ] = useState(false);
  const [ questionIdModal, setQuestionIdModal ] = useState("");
  const [ typeModal, setTypeModal ] = useState("");

  function userIsLogged() {
    if(!user) {
      toast.error("Você deve estar logado!");
      return;
    }

    return true;
  }

  async function userOwnsTheRoom() {
    const authorIdRoom = dataRoom?.authorId;

    if(user?.id === authorIdRoom) {
      return true;
    }

    toast.error("Você não pode executar está ação!");
    return;
  }

  async function closedRoom() {
    if(await userOwnsTheRoom()) {
      if(dataRoom?.endedAt) {
        toast.error("Está sala já está fechada!");
        return;
      } else {
        setTypeModal("close");
        setIsOpen(true);
      }
    }
  }


  async function deleteQuestion(questionId: string) {
    if(userIsLogged()) {
      if(await userOwnsTheRoom()) {
        setQuestionIdModal(questionId);
        setTypeModal("delete");
        setIsOpen(true);
      }
    }
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    if(userIsLogged()) {
      if(await userOwnsTheRoom()) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isAnswered: true,
        });
      }
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    if(userIsLogged()) {
      if(await userOwnsTheRoom()) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighLighted: true,
        });
      }
    }
  }

  async function handleLogOut() {
    await signOut();
    history.push("/");
  }

  return (
    <>
      {isOpen && (
        <Modal 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          roomId={roomId}
          questionId={questionIdModal}
          type={typeModal}
        />
      )}
      <div id="page-admin" className={theme}>
        <header className={theme}>
          <div className="content">
            <Link to="/">
              <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
            </Link>
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={closedRoom} disabled={!user}>Encerrar sala</Button>
              {user && <Button
                isOutlined
                onClick={handleLogOut}
                disabled={!user}
              >
                Sair  
              </Button>}
              <Toggle />
            </div>
          </div>
          <Toaster toastOptions={{ duration: 2100 }} />
        </header>
        <main>
          <div className={`room-title ${theme}`}>
            <h1>Sala: {title}</h1>
            {questionsQuantity > 0 && (
              <span>{questionsQuantity} perguntas(s)</span>
            )}
          </div>
          <div className="question-list">
            {questionsQuantity > 0 ? (
              questions.map((question) => {
                return (
                  <CardQuestion
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighLighted}
                    amountLike={question.likeCount}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </CardQuestion>
                );
              })
            ): (
              <div className="wait-question">
                <EmptyQuestion />
              </div>
            )}             
          </div>
        </main>
      </div>
    </>
  );
}