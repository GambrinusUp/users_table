import { useCallback, useEffect, useState } from "react";

// Хук для управления изменением размера столбцов таблицы
const useResizableTable = (columns, tableElement) => {
  const [activeIndex, setActiveIndex] = useState(null); // Индекс активного столбца, который в данный момент изменяется
  const minCellWidth = 50; // Минимальная ширина ячейки

  // Обработчик события мыши для начала изменения размера столбца при нажатии
  const mouseDown = (index, e) => {
    e.preventDefault();
    setActiveIndex(index); // Установка индекса активного столбца
    document.body.style.userSelect = "none";
  };

  // Обработчик события мыши для изменения размера столбца при передвижении
  const mouseMove = useCallback(
    (e) => {
      if (!tableElement.current) return;

      // Определение новых размеров столбцов
      const gridColumns = columns.map((col, i) => {
        if (i === activeIndex) {
          const width = e.clientX - col.ref.current.offsetLeft; // Расчет новой ширины столбца
          if (width >= minCellWidth) {
            // Если новая ширина больше минимальной
            return `minmax(${minCellWidth}px, ${
              (width / tableElement.current.clientWidth) * 100
            }%)`;
          }
          return `${minCellWidth}px`; // Установка минимальной ширины
        }
        if (i > activeIndex) {
          // Если столбец находится справа от активного столбца
          return `minmax(${minCellWidth}px, ${col.ref.current.clientWidth}fr)`;
        }
        // Если столбец находится слева от активного столбца
        return `${
          (col.ref.current.clientWidth / tableElement.current.clientWidth) * 100
        }%`;
      });

      // Применение новых размеров столбцов к таблице
      tableElement.current.style.gridTemplateColumns = gridColumns.join(" ");
    },
    [activeIndex, columns, minCellWidth, tableElement]
  );

  // Функция для удаления слушателей событий и восстановления стиля выделения текста
  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
    document.body.style.userSelect = "";
  }, [mouseMove]);

  // Обработчик события при отпускания кнопки мыши
  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [removeListeners]);

  // Добавления и удаления слушателей событий при изменении состояния `activeIndex`
  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  return { mouseDown, activeIndex };
};

export default useResizableTable;
