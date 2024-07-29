import { useEffect, useState } from "react";

import styles from "./MainPage.module.scss";

import { usersAPI } from "../../api/usersAPI";
import Input from "../../components/Input/Input";
import Table from "../../components/Table/Table";

function MainPage() {
  const [users, setUsers] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("firstName");

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSelectChange = (value) => {
    setSelectValue(value);
  };

  // Функция сортирует массив пользователей в соответствии с конфигурацией сортировки
  const handleSortChange = (column, sortOrder) => {
    // Определяем порядок сортировки
    const effectiveSortOrder = sortOrder === "default" ? "asc" : sortOrder;
    // Определяем ключ для сортировки (по умолчанию "id")
    const effectiveKey = sortOrder === "default" ? "id" : column;
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
      let aValue, bValue;
      // Определяем значения для сортировки в зависимости от ключа
      if (effectiveKey === "name") {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      } else if (effectiveKey === "address") {
        aValue = `${a.address.city}, ${a.address.address}`;
        bValue = `${b.address.city}, ${b.address.address}`;
      } else {
        aValue = a[effectiveKey];
        bValue = b[effectiveKey];
      }
      // Сравниваем значения и возвращаем результат в зависимости от порядка сортировки
      if (aValue < bValue) return effectiveSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return effectiveSortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  // Фильтрация пользователей
  const handleButtonClick = (input, select) => {
    setUsers(null);
    usersAPI
      .filterUserByKey(select, input)
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Отмена поиска
  const handleCancelClick = () => {
    setUsers(null);
    setInputValue("");
    usersAPI
      .getUsers()
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((error) => {
        alert(error);
      });
  };

  // Получение списка пользователей
  useEffect(() => {
    usersAPI
      .getUsers()
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <div className={styles.main_container}>
      <Input
        valueInput={inputValue}
        onChangeInput={handleInputChange}
        valueSelect={selectValue}
        onChangeSelect={handleSelectChange}
        onClickSearch={handleButtonClick}
        onClickCancel={handleCancelClick}
      />
      {users ? (
        <Table users={users} onSortChange={handleSortChange} />
      ) : (
        <div className={styles.main_container}>
          <span className={styles.table_loader}></span>
        </div>
      )}
      {users && users.length === 0 && <span>Нет совпадений</span>}
    </div>
  );
}

export default MainPage;
