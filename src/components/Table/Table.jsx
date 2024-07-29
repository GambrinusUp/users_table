import { useCallback, useRef, useState } from "react";

import { usersAPI } from "../../api/usersAPI";
import Modal from "../../components/Modal/Modal";
import { createHeaders } from "../../helpers/createHeaders";
import { getFullAddress } from "../../helpers/getFullAddress";
import { getFullNameUser } from "../../helpers/getFullNameUser";
import useModal from "../../hooks/useModal";
import useResizableTable from "../../hooks/useResizableTable";
import useTableHeight from "../../hooks/useTableHeight";
import { headers } from "../../utils/headers";
import styles from "../Table/Table.module.scss";

function Table({ users, onSortChange }) {
  const tableElement = useRef(null); // Ссылка на таблицу
  const tableHeight = useTableHeight(tableElement, users.length); // Хук для обновления высоты таблицы
  const columns = createHeaders(headers); // Создание заголовков таблицы
  const [userData, setUserData] = useState(null); // Данные о конкретном пользователе
  const { mouseDown, activeIndex } = useResizableTable(columns, tableElement); // Хук для изменения ширины столбцов
  const { isOpen, toggle } = useModal(); // Хук для управления модальным окном

  // Конфигурация сортировки
  const [sortingConfig, setSortingConfig] = useState([
    { column: "name", sortDirection: "default" },
    { column: "age", sortDirection: "default" },
    { column: "gender", sortDirection: "default" },
    { column: "address", sortDirection: "default" },
  ]);

  // Изменение конфигурации сортировки, при клике на соответствующий заголовок
  const handleChangeSort = useCallback(
    (columnName) => {
      if (columnName === "phone") return;
      const newSortingConfig = sortingConfig.map((config) => {
        if (config.column === columnName) {
          const currentDirection = config.sortDirection;
          // Определение нового направления сортировки
          let newDirection;
          if (currentDirection === "default") {
            newDirection = "asc";
          } else if (currentDirection === "asc") {
            newDirection = "desc";
          } else {
            newDirection = "default";
          }
          return { ...config, sortDirection: newDirection };
        } else {
          return { ...config, sortDirection: "default" };
        }
      });
      setSortingConfig(newSortingConfig);
      const activeSortConfig = newSortingConfig.find(
        (config) => config.column === columnName
      );
      if (activeSortConfig) {
        onSortChange(activeSortConfig.column, activeSortConfig.sortDirection);
      }
    },
    [sortingConfig, onSortChange]
  );

  // Функция для открытия модального окна и получения данных о пользователе по его ID
  const handleOpenModal = (userId) => {
    setUserData(null);
    toggle();
    usersAPI
      .getUserById(userId)
      .then((user) => {
        setUserData(user);
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Функция для получения символа сортировки
  const getSorting = (columnName) => {
    const directionMap = {
      default: "↕",
      asc: "↑",
      desc: "↓",
    };

    const columnConfig = sortingConfig.find(
      (config) => config.column === columnName
    );

    return directionMap[columnConfig?.sortDirection] || "↕";
  };

  return (
    <div className={styles.table_container}>
      <table ref={tableElement}>
        <thead>
          <tr>
            {columns.map(({ ref, text }, index) => (
              <th
                ref={ref}
                key={text.name}
                onClick={() => handleChangeSort(text.column)}
              >
                {text.column !== "phone" ? (
                  <span>{text && text.name}</span>
                ) : (
                  <span>{text && text.name}</span>
                )}
                {text.column !== "phone" && getSorting(text.column)}
                <div
                  style={{ height: tableHeight }}
                  onMouseDown={(e) => mouseDown(index, e)}
                  className={`${styles.resizeHandle} ${
                    activeIndex === index ? styles.active : ""
                  }`}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr
                key={user.id}
                onClick={() => {
                  handleOpenModal(user.id);
                }}
              >
                <td>
                  <span>
                    {getFullNameUser(
                      user.firstName,
                      user.lastName,
                      user.maidenName
                    )}
                  </span>
                </td>
                <td>
                  <span>{user.age}</span>
                </td>
                <td>
                  <span>{user.gender}</span>
                </td>
                <td>
                  <span>{user.phone}</span>
                </td>
                <td>
                  <span>{getFullAddress(user.address)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} toggle={toggle} user={userData} />
    </div>
  );
}

export default Table;
