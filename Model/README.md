

# Models

This folder contains the final trained machine learning models used by the OpenAML project. These models are designed to detect on-chain financial crime based on wallet-level transaction features. All models were trained using a dataset of over **30,000 wallets**, each represented by 16 engineered features derived from blockchain activity.

---

##  Data Format

To use these models correctly, input data must follow the same structure as the training dataset. Below is a description of each required feature:

| Feature                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `total_transaction_count` | Total number of transactions by the wallet.              |
| `total_transaction_sum`   | Sum of the value of all transactions by the wallet.      |
| `big_transaction_count`   | Count of transactions above a defined "big" threshold.   |
| `big_transaction_sum`     | Sum of values of "big" transactions.                     |
| `small_transaction_count` | Count of transactions below the "small" threshold.       |
| `small_transaction_sum`   | Sum of values of "small" transactions.                   |
| `from_transaction_count`  | Number of transactions where the wallet is the sender.   |
| `from_transaction_sum`    | Total amount sent by the wallet.                         |
| `to_transaction_count`    | Number of transactions where the wallet is the receiver. |
| `to_transaction_sum`      | Total amount received by the wallet.                     |
| `to_unique_wallet`        | Number of unique wallets that sent funds to this wallet. |
| `from_unique_wallet`      | Number of unique wallets this wallet sent funds to.      |
| `from_unique_big`         | Unique sender wallets involved in big transactions.      |
| `to_unique_big`           | Unique receiver wallets involved in big transactions.    |
| `from_unique_small`       | Unique sender wallets involved in small transactions.    |
| `to_unique_small`         | Unique receiver wallets involved in small transactions.  |

---

## 🧪 Example Usage (Python)

Below is a minimal example of how to use a trained model from this folder to make a prediction using a JSON input:

```python
import pandas as pd
import joblib
import numpy as np

# Load the model and scaler
model = joblib.load("models/XGBoost.joblib")
scaler = joblib.load("models/scaler.pkl")

# Define wallet data
wallet_data = {
    "total_transaction_count": 152,
    "total_transaction_sum": 87000.0,
    "big_transaction_count": 10,
    "big_transaction_sum": 50000.0,
    "small_transaction_count": 142,
    "small_transaction_sum": 37000.0,
    "from_transaction_count": 75,
    "from_transaction_sum": 42000.0,
    "to_transaction_count": 77,
    "to_transaction_sum": 45000.0,
    "to_unique_wallet": 22,
    "from_unique_wallet": 21,
    "from_unique_big": 4,
    "to_unique_big": 5,
    "from_unique_small": 12,
    "to_unique_small": 11
}

# Prepare input
df = pd.DataFrame([wallet_data])
exclude_columns = ['to_unique_wallet', 'from_unique_wallet']
columns_to_scale = [col for col in df.columns if col not in exclude_columns]
df[columns_to_scale] = scaler.transform(df[columns_to_scale])

# Predict
prediction = model.predict_proba(df)[:, 1]  # 1 = probability of 'positive' (risky wallet)
print("Risk score:", prediction[0])
```

---

## Models Available

* `CatBoost.joblib`
* `LightGBM.joblib`
* `XGBoost.joblib`
* `RandomForest.joblib`
* `LogisticRegression.joblib`
* `scaler.pkl` – Standard scaler used to normalize numerical inputs during training

