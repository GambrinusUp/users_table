import { useState } from "react";

// Хук для управлением модальным окном
export default function useModal() {
  const [isOpen, setIsOpen] = useState(false); // Состояние, для хранения и установки видимости модального окна

  // Переключение видимости модального окна
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    toggle,
  };
}
