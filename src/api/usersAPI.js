const API_URL = "https://dummyjson.com/";

// Параметры запроса, для выборки нужных данных
const requestOptions =
  "limit=0&select=firstName,lastName,maidenName,age,gender,phone,address";

// Получение списка пользователей
async function getUsers() {
  try {
    const response = await fetch(API_URL + "users?" + requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data.users;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
}

// Поиск пользователей по определённому ключу (например, по имени)
async function filterUserByKey(key, value) {
  try {
    const encodedValue = encodeURIComponent(value);
    const filterOptions = `filter?key=${key}&value=${encodedValue}`;
    const response = await fetch(
      API_URL + "users/" + filterOptions + "&" + requestOptions
    );
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data.users;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
}

// Получение информации о конкретном пользователе
async function getUserById(id) {
  try {
    const requestOptions =
      "?select=firstName,lastName,maidenName,age,address,height,weight,phone,email";
    const response = await fetch(API_URL + "users/" + id + requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
}

// Экспорт функций
export const usersAPI = {
  getUsers: getUsers,
  filterUserByKey: filterUserByKey,
  getUserById: getUserById,
};
