from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.metrics import roc_auc_score, accuracy_score, f1_score, recall_score
from sklearn.pipeline import Pipeline
from catboost import CatBoostClassifier
import pandas as pd
import joblib
import os

def main(file_path=os.path.join("data", "processed.csv")):
    # Load dataset
    model_name = "CatBoost.joblib"
    # Load data and clean data
    print("Loading CSV file...")
    df = pd.read_csv(file_path)

    # Split data into features and target
    X = df.iloc[:, :-1]  # Include all columns except the last one as features
    y = df.iloc[:, -1]   # Last column as target

    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    print("Training set X size:", X_train.shape)
    print("Test set X size:", X_test.shape)

    # Define the parameters grid for GridSearchCV
    param_grid = {
        'iterations': [100, 150, 200, 250, 300],  # Equivalent to n_estimators in XGBoost
        'learning_rate': [0.01, 0.1, 0.25, 0.5],
        'depth': [3, 5, 7, 9],               # Equivalent to max_depth in XGBoost
        'subsample': [0.8, 0.9, 1.0]
    }

    # Create a CatBoost classifier
    catboost = CatBoostClassifier(
        loss_function='Logloss',  # Binary classification loss function
        random_seed=0,
        verbose=0                 # Suppress training output for cleaner logs
    )

    # Define Stratified K-Fold cross-validation with k=3
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=0)

    # Perform grid search with cross-validation
    grid_search = GridSearchCV(estimator=catboost,
                               param_grid=param_grid,
                               scoring='f1',  # Use F1-score for optimization
                               cv=cv,
                               verbose=1,
                               n_jobs=-1)

    # Fit the model on the training data
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

    # Predict on the test set
    y_pred = best_model.predict(X_test)
    acc_score = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)

    print("Test Accuracy Score:", acc_score)
    print("Test F1 Score:", f1)
    print("Test Recall Score:", recall)

    final_pipeline = Pipeline([
        ('catboost', CatBoostClassifier(
            loss_function='Logloss', random_seed=0, verbose=0,
            **{
                'iterations': best_params['iterations'],
                'learning_rate': best_params['learning_rate'],
                'depth': best_params['depth'],
                'subsample': best_params['subsample']
            }
        ))
    ])

    final_pipeline.fit(X, y)  # Retrain on the entire dataset
    print("Model Ready")
    
    # Export the trained pipeline
    print("Exporting the pipeline...")
    joblib.dump(final_pipeline, os.path.join("models", f"{model_name}"))
    print("Export Complete")

if __name__ == "__main__":
    main()
