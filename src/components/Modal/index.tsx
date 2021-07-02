import closeImg from '../../assets/images/close.svg';
import deleteModalImg from '../../assets/images/delete-modal.svg';
import { Button } from '../Button/index';
import { database } from '../../services/firebase';
import { useHistory } from 'react-router-dom';

import '../Modal/style.scss';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  roomId: string;
  questionId: string;
  type: string;
};

export function Modal({
  isOpen,
  setIsOpen,
  roomId,
  questionId,
  type,
}: ModalProps) {
  const history = useHistory();

  async function handleClosedRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    closeModal();
    history.push("/");
  }

  async function handleDeleteQuestion() {
    closeModal();
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .remove();
  }

  function closeModal() {
    setIsOpen(false);
  }

  const title_close = "Encerrar Sala";
  const subtitle_close = "Tem certeza que você deseja encerrar esta sala?"
  const title_delete = "Deletar pergunta";
  const subtitle_delete = "Tem certeza que você deseja deletar esta pergunta?"

  return(
    <div className="modal-container">
      <div className="modal">
        <img src={type === "close" ? closeImg : deleteModalImg} alt="Closed Room" />
        <h3>{type === "close" ? title_close : title_delete}</h3>
        <span>{type === "close" ? subtitle_close : subtitle_delete}</span>
        <div className="buttons">
          <Button
            isOutlined onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            isOutlined onClick={type === "close" ? handleClosedRoom : handleDeleteQuestion}
          >
            {type === "close" ? "Sim, encerrar" : "Sim, deletar"}
          </Button>
        </div>
      </div>
    </div>
  );
}