from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the trained models
model_catboost = joblib.load(os.path.join('models', 'CatBoost.joblib'))
model_lightgbm = joblib.load(os.path.join('models', 'LightGBM.joblib'))
model_xgboost = joblib.load(os.path.join('models', 'XGBoost.joblib'))
model_logistic_regression = joblib.load(os.path.join('models', 'LogisticRegression.joblib'))
model_random_forest = joblib.load(os.path.join('models','RandomForest.joblib'))

# Load the scaler
scaler = joblib.load(os.path.join("models", "scaler.pkl"))

def softmax(x):
    """Compute softmax values for each set of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    # Parse JSON input
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON data received'}), 400
    
    try:
        # Extract features from the JSON input
        df = pd.DataFrame([data])
        
        # Scale the features using the loaded scaler
        exclude_columns = ['to_unique_wallet', 'from_unique_wallet']
        features_to_scale = [col for col in df.columns if col not in exclude_columns]
        df[features_to_scale] = scaler.transform(df[features_to_scale])
        
        # Predict probabilities with each model
        prob_catboost = model_catboost.predict_proba(df)[:, 0] # 0 is for negative (target output)
        prob_lightgbm = model_lightgbm.predict_proba(df)[:, 0]
        prob_xgboost = model_xgboost.predict_proba(df)[:, 0]
        prob_logistic_regression = model_logistic_regression.predict_proba(df)[:, 0]
        prob_random_forest = model_random_forest.predict_proba(df)[:,0]
        
        # Concatenate probabilities into a single array
        all_probabilities = np.concatenate((
            prob_catboost,
            prob_lightgbm,
            prob_xgboost,
            prob_logistic_regression,
            prob_random_forest
        ))
        
        # Return the concatenated probabilities as JSON
        return jsonify({'probabilities': all_probabilities.tolist()})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


