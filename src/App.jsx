import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isHebrew, setIsHebrew] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const url = import.meta.env.VITE_API_URL + "/transactions";
    const response = await fetch(url);
    const data = await response.json();
    setTransactions(data);
    calculateBalance(data);
  };

  const calculateBalance = (transactions) => {
    const total = transactions.reduce((acc, transaction) => acc + (transaction.price || 0), 0);
    setBalance(total);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !date || !description) {
      alert(isHebrew ? "אנא מלא את כל השדות לפני שליחת הטופס." : "Please fill out all fields before submitting.");
      return;
    }

    const price = parseFloat(name.split(' ')[0]);
    const title = name.substring(price.toString().length + 1);

    const url = import.meta.env.VITE_API_URL + "/transaction";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        name: title,
        date,
        description,
      }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      setTransactions([...transactions, data]);
      setBalance(balance + price);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  };

  const handleDelete = (id, price) => {
    const url = import.meta.env.VITE_API_URL + `/transaction/${id}`;

    fetch(url, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        setBalance(balance - price);
      } else {
        throw new Error(isHebrew ? "נכשל במחיקת העסקה" : "Failed to delete transaction");
      }
    })
    .catch((error) => {
      console.error("There was a problem with the delete operation:", error);
    });
  };

  const toggleLanguage = () => {
    setIsHebrew(!isHebrew);
  };

  return (
    <main>
      <div className="balance-container">
        <h1>{isHebrew ? "₪" : "$"}{balance.toFixed(2)}</h1>
        <button className="lang-toggle" onClick={toggleLanguage}>
          {isHebrew ? "EN" : "HE"}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="information">
          <input
            type="text"
            value={name}
            placeholder={isHebrew ? "לדוגמה: +2000 משכורת" : "ex: +2000 Salary"}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder={isHebrew ? "תיאור" : "Description"}
          />
        </div>
        <button type="submit">{isHebrew ? "הוסף עסקה חדשה" : "Add New Transaction"}</button>
      </form>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price >= 0 ? "green" : "red"}`}>
                {isHebrew ? "₪" : "$"}{transaction.price?.toFixed(2) || 0}
              </div>
              <div className="date">{new Date(transaction.date).toLocaleString()}</div>
              <button onClick={() => handleDelete(transaction._id, transaction.price)}>
                {isHebrew ? "מחק" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
