import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button/index';
import { Question } from '../components/Question/index';
import { RoomCode } from '../components/RoomCode/index';
import '../styles/room.scss';
import '../components/Question/style.scss';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg';
import { database } from '../services/firebase';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
//import { useAuth } from '../hooks/useAuth';

type RoomParams = {
  id: string;
}

export function AdminRoom () {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  //const { user } = useAuth();
  const { title, questions } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
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

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
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