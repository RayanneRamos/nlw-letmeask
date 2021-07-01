import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button/index';
import { Question } from '../../components/Question/index';
import { RoomCode } from '../../components/RoomCode/index';
import '../AdminRoom/style.scss';
import '../../components/Question/style.scss';
import { useRoom } from '../../hooks/useRoom';
import deleteImg from '../../assets/images/delete.svg';
import { database } from '../../services/firebase';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
//import { useAuth } from '../hooks/useAuth';
import logoDarkImg from '../../assets/images/logo-dark.svg';
import { useTheme } from '../../hooks/useTheme';
import { Toggle } from '../../components/Toggle/index';

type RoomParams = {
  id: string;
}

export function AdminRoom () {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  //const { user } = useAuth();
  const { title, questions } = useRoom(roomId);
  const { theme } = useTheme();

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
      roomIsOpen: false
    });

    history.push('/');
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    })
  }

  function handleGoHomePage() {
    return history.push('/');
  }

  return (
    <div id="page-admin" className={theme}>
      <header className={theme}>
        <div className="content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" onClick={handleGoHomePage} />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            <Toggle />
          </div>
        </div>
      </header>
      <main>
        <div className={`room-title ${theme}`}>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question 
              key = {question.id}
              content = {question.content}
              author = {question.author}
              isAnswered={question.isAnswered}
              isHighLighted={question.isHighLighted}
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
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}              
        </div>
      </main>
    </div>
  );
}