import pandas as pd
from sklearn.preprocessing import StandardScaler
import os
from imblearn.over_sampling import SMOTE
import joblib

path = os.path.join("data", "raw.csv")

df = pd.read_csv(path) 

#drop wallet id (primary key)
df = df.drop("wallet_id", axis=1) 

# transform flags to 0/1
df[df.columns[-1]] = df[df.columns[-1]].map({'Positive': 1, 'Negative': 0})

# apply standard scaler
X = df.iloc[:,:-1]
y = df.iloc[:,-1]
exclude_columns = ['to_unique_wallet', 'from_unique_wallet']
# Get the list of columns to scale
features_to_scale = [col for col in X.columns if col not in exclude_columns]
scaler = StandardScaler()
X[features_to_scale] = scaler.fit_transform(X[features_to_scale])
print(X.head())
joblib.dump(scaler, os.path.join('models','scaler.pkl'))

# generate synthetic data
print("Category distribution before processing:", df["classification"].value_counts(normalize=True))

majority_count = y.value_counts()[1]
target_minority_count = int((4 / 6) * majority_count)

smote = SMOTE(sampling_strategy={0: target_minority_count}, random_state=0)
X_resampled, y_resampled = smote.fit_resample(X, y)

combined_data = pd.concat([pd.DataFrame(X_resampled), pd.DataFrame(y_resampled)], axis=1)
combined_data.columns = list(X.columns) + ["classification"]
print("Category distribution after processing:", combined_data["classification"].value_counts(normalize=True))
# save to file
combined_data.to_csv(os.path.join("data", "processed.csv"), index=False)
