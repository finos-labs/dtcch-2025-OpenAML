[![FINOS - Incubating](https://cdn.jsdelivr.net/gh/finos/contrib-toolbox@master/images/badge-incubating.svg)](https://finosfoundation.atlassian.net/wiki/display/FINOS/Incubating)

# FINOS DTCC Hackathon 


## Project Name
AI Anti Money Laundering for Digital Wallels

### Project Details


### Team Information
Cartier Huang 	<cartier.huang@duke.edu>	https://github.com/cw183
Haochen Li 	<haochen.li2@duke.edu>	https://github.com/Harrisous
Luciano Juvinski 	<luciano.silva@duke.edu>	https://github.com/juv1nsk1
Yifei Ren 	<yifei.ren@duke.edu>	https://github.com/yifei888
Yiqing Liu 	<yiqing.liu@duke.edu>	https://github.com/ludaladila

### Project Structure
1. Data sourcing and processing
.\data-pipeline
2. Stucture for model data processing and model training
```
DTCH-2025-CIPHER/
│── data/
│   ├── raw.csv              # Original dataset
│
│── models/                  # Trained machine learning models
│   ├── CatBoost.joblib
│   ├── LightGBM.joblib
│   ├── LogisticRegression.joblib
│   ├── RandomForest.joblib
│   ├── XGBoost.joblib
│   ├── scaler.pkl           # Pre-fitted scaler for normalization
│
│── test_post/               # Prediction outputs
│   ├── predict_prob0.json
│   ├── predict_prob1.json
│
│── utils/                   # Utility scripts for data processing & modeling
│   ├── data_info.py
│   ├── data_process.py
│   ├── catboost_model.py
│   ├── lightgbm_model.py
│   ├── logistic_regression.py
│   ├── random_forest.py
│   ├── xgboost_model.py
│
│── venv/                    # Virtual environment (ignored in Git)
│── app.py                    # Main script for running model inference
│── requirements.txt          # Dependencies list
│── README.md                 # Project documentation
│── LICENSE                   # License information
│── .gitignore                # Git ignore file
```
3. App that host API for request
.\site-sentinel

## Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/DTCH-2025-CIPHER.git
cd DTCH-2025-CIPHER
```

### 2️⃣ Create a Virtual Environment (Optional)
```bash
python -m venv venv
source venv/bin/activate  # For Mac/Linux
venv\Scripts\activate     # For Windows
```

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

## Usage
### 🔹 Train a Model
Run the corresponding script from the `utils/` folder to train an individual model. Example:
```bash
python utils/random_forest.py
```
The model will be stored in ./models as joblib files

### 🔹 Make Online Predictions
Use `app.py` or a trained model from `models/` to generate predictions:
```bash
python app.py
```

## Machine Learning Pipeline
The pipeline consists of the following stages:
### Data Preprocessing
   - Load raw data (the same data from previous step "data sourcing and processing")
   - Handle missing values, outliers, uncessary features, feature mapping  
   - Scale numerical features
   - Data Augumentation using SMOTE to achieve 6:4 majority and minority ratio
   - Export processed data to processed.csv

### Model Training
0. Split data into training and testing sets
1. Train multiple models:
   - Logistic Regression
   - CatBoost
   - LightGBM
   - XGBoost
   - Random Forest

2. Use **GridSearchCV** for hyperparameter tuning  
3. Evaluate models using cross-validation 

## Using DCO to sign your commits

**All commits** must be signed with a DCO signature to avoid being flagged by the DCO Bot. This means that your commit log message must contain a line that looks like the following one, with your actual name and email address:

```
Signed-off-by: John Doe <john.doe@example.com>
```

Adding the `-s` flag to your `git commit` will add that line automatically. You can also add it manually as part of your commit log message or add it afterwards with `git commit --amend -s`.

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for more information

### Helpful DCO Resources
- [Git Tools - Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [Signing commits
](https://docs.github.com/en/github/authenticating-to-github/signing-commits)


## License

Copyright 2025 FINOS

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)








