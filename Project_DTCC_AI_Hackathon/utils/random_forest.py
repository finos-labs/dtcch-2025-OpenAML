import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, roc_auc_score, accuracy_score, f1_score, recall_score
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
import os

class RandomForest:
    def __init__(self):
        self.model = RandomForestClassifier(random_state=42)
        
    def grid_search(self, X, y):
        param_grid = {
        'n_estimators': [100, 300],  
        'min_samples_split': [5, 10], 
        'min_samples_leaf': [2, 4],  
        'max_features': ['sqrt']      
    }
        
        grid_search = GridSearchCV(
            self.model, 
            param_grid, 
            cv=5, 
            n_jobs=-1, 
            scoring='f1',
            verbose=2
        )
        
        grid_search.fit(X, y)
        print(f"\nBest parameters: {grid_search.best_params_}")
        print(f"Best score: {grid_search.best_score_:.4f}")
        
        self.model = grid_search.best_estimator_
        return grid_search
        
    def train(self, X, y): 
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
        grid_search = self.grid_search(X_train, y_train)

        best_params = grid_search.best_params_
        print("\n**Best Parameters Found** ")
        for param, value in best_params.items():
            print(f"➡ {param}: {value}")
        print(" **End of Best Parameters** \n")

    
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]  

    
        test_auroc = roc_auc_score(y_test, y_pred_proba)
        test_accuracy = accuracy_score(y_test, y_pred)
        test_f1 = f1_score(y_test, y_pred)
        test_recall = recall_score(y_test, y_pred)

        print("\n=== Test Score  ===")
        print(f"Test set AUROC: {test_auroc:.6f}")
        print(f"Test Accuracy Score: {test_accuracy:.6f}")
        print(f"Test F1 Score: {test_f1:.6f}")
        print(f"Test Recall Score: {test_recall:.6f}")
        print("=========================\n")


        self.plot_confusion_matrix(y_test, y_pred)
        self.plot_feature_importance(X)
    
       
        cv_scores = cross_val_score(self.model, X, y, cv=5)
        print(f"\nCross-validation scores: {cv_scores.mean():.4f} (±{cv_scores.std()*2:.4f})")
    
        return self.model       
        
    def plot_confusion_matrix(self, y_true, y_pred):
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.show()
    
    def plot_feature_importance(self, X):
        importance = pd.DataFrame({
            'feature': X.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(data=importance.head(10), x='importance', y='feature')
        plt.title('Top 10 Most Important Features')
        plt.show()
    
    def save_model(self, model, path=os.path.join('models','RandomForest.joblib')):
        joblib.dump(model, path)
    
    def predict(self, X):
        return self.model.predict(X)

def main():
    df = pd.read_csv('./data/processed.csv')
    
    X = df.drop('classification', axis=1)
    y = df['classification']
    
    classifier = RandomForest()
    model = classifier.train(X, y)
    classifier.save_model(model)

if __name__ == "__main__":
    main()