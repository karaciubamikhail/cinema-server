import React from 'react';
import { useSelector } from 'react-redux';
import ModalHallAdd from './ModalHallAdd';
import ModalHallDelete from './ModalHallDelete';
import ModalMovieAdd from './ModalMovieAdd';
import ModalMovieEdit from './ModalMovieEdit';
import ModalMovieDelete from './ModalMovieDelete';
import ModalSeanceAdd from './ModalSeanceAdd';
import ModalSeanceDelete from './ModalSeanceDelete';

export default function ModalSelect() {
  const { activeModal } = useSelector((state) => state.modal);
  switch (activeModal) {
    case 'ModalHallAdd':
      return <ModalHallAdd />;

    case 'ModalHallDelete':
      return <ModalHallDelete />;

    case 'ModalMovieAdd':
      return <ModalMovieAdd />;

    case 'ModalMovieEdit':
      return <ModalMovieEdit />;

    case 'ModalMovieDelete':
      return <ModalMovieDelete />;

    case 'ModalSeanceAdd':
      return <ModalSeanceAdd />;

    case 'ModalSeanceDelete':
      return <ModalSeanceDelete />;

    default:
      return null;
  }
}
