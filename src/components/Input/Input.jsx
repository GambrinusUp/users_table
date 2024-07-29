import styles from "./Input.module.scss";

function Input({
  valueInput,
  onChangeInput,
  valueSelect,
  onChangeSelect,
  onClickSearch,
  onClickCancel,
}) {
  const handleInputChange = (event) => {
    if (onChangeInput) {
      onChangeInput(event.target.value);
    }
  };

  const handleSelectChange = (event) => {
    if (onChangeSelect) {
      onChangeSelect(event.target.value);
    }
  };

  const handleClickSearch = () => {
    if (onClickSearch && valueInput !== "") {
      onClickSearch(valueInput, valueSelect);
    }
  };

  const handleClickCancel = () => {
    if (onClickCancel) {
      onClickCancel();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClickSearch();
    }
  };

  return (
    <div className={styles.input_container}>
      <div className={styles.input_search}>
        <input
          value={valueInput}
          onChange={handleInputChange}
          placeholder="Например, `Emily`"
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClickCancel}>✖</button>
      </div>
      <div className={styles.input_control}>
        <select value={valueSelect} onChange={handleSelectChange}>
          <option value="firstName">По имени</option>
          <option value="lastName">По фамилии</option>
          <option value="age">По возрасту</option>
          <option value="gender">По полу</option>
          <option value="phone">По номеру телефона</option>
          <option value="address.city">По городу</option>
          <option value="address.address">По улице</option>
        </select>
        <button onClick={handleClickSearch}>Поиск</button>
      </div>
    </div>
  );
}

export default Input;
