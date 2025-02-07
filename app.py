from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import pandas as pd
from scipy.special import softmax

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
        all_probabilities = np.vstack((
            prob_catboost,
            prob_lightgbm,
            prob_xgboost,
            prob_logistic_regression,
            prob_random_forest
        )).T  # Shape: (n_samples, n_models)
        softmax_probabilities = softmax(all_probabilities, axis=1) 
        final_probabilities_soft_voting = np.mean(softmax_probabilities, axis=1)

        # Return the concatenated probabilities as JSON
        return jsonify(
            {'prediction_breakdown': 
                {
                    'catboost': prob_catboost.tolist()[0],
                    'lightgbm': prob_lightgbm.tolist()[0],
                    'xgboost': prob_xgboost.tolist()[0],
                    'logistic_regression': prob_logistic_regression.tolist()[0],
                    'random_forest': prob_random_forest.tolist()[0]
                },
            'final_prediction':final_probabilities_soft_voting.tolist()[0]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


