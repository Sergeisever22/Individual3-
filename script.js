document.addEventListener("DOMContentLoaded", function () {
    /**
     * Массив, содержащий все транзакции.
     * @type {Object[]}
     */
    const transactions = [];
  
    /**
     * Уникальный идентификатор для каждой транзакции.
     * @type {number}
     */
    let transactionId = 0;
  
    /**
     * Форма для добавления новой транзакции.
     * @type {HTMLElement}
     */
    const form = document.getElementById("transaction-form");
  
    /**
     * Таблица для отображения транзакций.
     * @type {HTMLElement}
     */
    const table = document.getElementById("transaction-table").getElementsByTagName("tbody")[0];
  
    /**
     * Элемент для отображения общей суммы транзакций.
     * @type {HTMLElement}
     */
    const totalDisplay = document.getElementById("total");
  
    /**
     * Элемент для отображения деталей выбранной транзакции.
     * @type {HTMLElement}
     */
    const detailDisplay = document.getElementById("transaction-detail");
  
    /**
     * Обработчик события отправки формы для добавления транзакции.
     * @param {Event} event - Событие отправки формы.
     */
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      addTransaction();
    });
  
    /**
     * Обработчик события клика на таблице транзакций.
     * @param {Event} event - Событие клика на таблице.
     */
    table.addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-btn")) {
        const id = parseInt(event.target.dataset.id);
        deleteTransaction(id);
      } else if (event.target.closest("tr")) {
        const id = parseInt(event.target.closest("tr").dataset.id);
        displayTransactionDetail(id);
      }
    });
  
    /**
     * Добавляет новую транзакцию в массив и обновляет таблицу и общую сумму.
     */
    function addTransaction() {
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value;
      const description = document.getElementById("description").value;
  
      /**
       * Новая транзакция.
       * @type {Object}
       */
      const transaction = {
        id: ++transactionId,
        date: new Date().toLocaleString(),
        amount,
        category,
        description,
      };
  
      transactions.push(transaction);
      appendTransactionToTable(transaction);
      calculateTotal();
    }
  
    /**
     * Добавляет новую транзакцию в таблицу.
     * @param {Object} transaction - Новая транзакция для добавления в таблицу.
     */
    function appendTransactionToTable(transaction) {
      const row = table.insertRow();
      row.dataset.id = transaction.id;
      if (transaction.amount !== 0) row.classList.add(transaction.amount > 0 ? "income" : "expense");
  
      const cellId = row.insertCell(0);
      const cellDate = row.insertCell(1);
      const cellCategory = row.insertCell(2);
      const cellDescription = row.insertCell(3);
      const cellAction = row.insertCell(4);
  
      cellId.textContent = transaction.id;
      cellDate.textContent = transaction.date;
      cellCategory.textContent = transaction.category;
      cellDescription.textContent = transaction.description.length > 4 ? `${transaction.description.slice(0, 4)}...` : transaction.description;
      cellAction.innerHTML = `<button class="delete-btn" data-id="${transaction.id}">Удалить</button>`;
    }
  
    /**
     * Удаляет транзакцию из массива и обновляет таблицу и общую сумму.
     * @param {number} id - Идентификатор удаляемой транзакции.
     */
    function deleteTransaction(id) {
      const index = transactions.findIndex((transaction) => transaction.id === id);
      if (index > -1) {
        transactions.splice(index, 1);
        table.deleteRow(index);
        calculateTotal();
      }
    }
  
    /**
     * Вычисляет и отображает общую сумму всех транзакций.
     */
    function calculateTotal() {
      const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      totalDisplay.textContent = `Всего: ${total.toFixed(2)} MDL`;
    }
  
    /**
     * Отображает подробную информацию о выбранной транзакции.
     * @param {number} id - Идентификатор выбранной транзакции.
     */
    function displayTransactionDetail(id) {
      const transaction = transactions.find((transaction) => transaction.id === id);
      if (transaction) {
        const fields = [
          `ID: ${transaction.id}`,
          `Категория: ${transaction.category}`,
          `Описание: ${transaction.description}`,
          `Сумма: ${transaction.amount.toFixed(2)} MDL`,
          `Дата транзакции: ${transaction.date}`,
        ];
        detailDisplay.innerHTML = "";
        fields.forEach((field) => {
          const p = document.createElement("p");
          p.textContent = field;
          detailDisplay.appendChild(p);
        });
      }
    }
  });