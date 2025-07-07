from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, accuracy_score, f1_score, recall_score
from sklearn.pipeline import Pipeline
import joblib
import pandas as pd
import os

def main(file_path = os.path.join("data","processed.csv")):
    model_name = "LogisticRegression.joblib"
    # Load data and clean data
    print("Loading CSV file...")
    df = pd.read_csv(file_path)

    # Split data into features and target
    X = df.iloc[:, :-1]  # Include all columns except the last one as features
    y = df.iloc[:, -1]   # Last column as target

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    print("Training set X size:", X_train.shape)
    print("Test set X size:", X_test.shape)


    # model gridsearch
    param_grid = {
        'logreg__C': [0.001, 0.005, 0.01, 0.1, 1, 10],
        'logreg__penalty': ['l1', 'l2'],
        'logreg__solver': ['liblinear', 'saga']
    }
    pipeline = Pipeline([
        ('logreg', LogisticRegression(max_iter=100000))
    ])

    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=0)

    grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, cv=cv,
                                   scoring='roc_auc', n_jobs=-1)  # Use roc_auc for binary classification
    grid_search.fit(X_train, y_train)

    # Validation score
    best_params = grid_search.best_params_
    print("Best Parameters:", best_params)
    print("Best Score:", grid_search.best_score_)

    # Test score
    print("=== Test Score ===")
    best_model = grid_search.best_estimator_
    y_test_probs = best_model.predict_proba(X_test)[:, 1]
    test_auroc = roc_auc_score(y_test, y_test_probs)
    print("Test set AUROC:", test_auroc)

    y_pred = best_model.predict(X_test)
    acc_score = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)

    print("Test Accuracy Score:", acc_score)
    print("Test F1 Score:", f1)
    print("Test Recall Score:", recall)

    final_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('logreg', LogisticRegression(max_iter=100000, **{
            'C': best_params['logreg__C'],
            'penalty': best_params['logreg__penalty'],
            'solver': best_params['logreg__solver']
        }))
    ])
    
    final_pipeline.fit(X, y)  # Retrain on the entire dataset
    print("Model Ready")
    
    # Export the trained pipeline
    print("Exporting the pipeline...")
    joblib.dump(final_pipeline, os.path.join("models",f"{model_name}"))
    print("Export Complete")

if __name__ == "__main__":
    main()