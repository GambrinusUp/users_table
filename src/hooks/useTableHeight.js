import { useState, useEffect } from "react";

// Хук для управления высотой таблицы
const useTableHeight = (tableElementRef, usersLength) => {
  const [tableHeight, setTableHeight] = useState("auto"); // Состояние для хранения высоты таблицы

  useEffect(() => {
    // Функция для обновления высоты таблицы
    const updateTableHeight = () => {
      if (tableElementRef.current) {
        setTableHeight(tableElementRef.current.clientHeight);
      }
    };
    // Добавление обработчика события изменения размера окна
    window.addEventListener("resize", updateTableHeight);

    // Первоначальное обновление высоты таблицы
    updateTableHeight();

    // Очистка обработчика события при размонтировании компонента
    return () => {
      window.removeEventListener("resize", updateTableHeight);
    };
  }, [tableElementRef, usersLength]);

  return tableHeight;
};

export default useTableHeight;
