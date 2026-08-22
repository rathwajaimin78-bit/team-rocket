import json
import os
import pandas as pd
import kagglehub
from google import genai
from google.genai import types

# Initialize Gemini Client (Uses GEMINI_API_KEY environment variable)
client = genai.Client()

# ==========================================
# STEP 1: Download Weather Dataset from Kaggle
# ==========================================
print("1. Downloading Kaggle Dataset...")

# Downloading 'Rain Forecasting in India' dataset from Kaggle
dataset_path = kagglehub.dataset_download("kalashnikov1405/rain-forecasting-in-india")
csv_file_path = os.path.join(dataset_path, "rain_forecasting.csv")

print(f"Dataset downloaded to: {csv_file_path}")

# Load the tabular dataset
df = pd.read_csv(csv_file_path)


# ==========================================
# STEP 2: Preprocess & Convert to JSONL Format
# ==========================================
print("2. Converting tabular weather data to Gemini SFT format...")

jsonl_file_path = "rainfall_training_data.jsonl"
jsonl_records = []

# Iterate over dataset rows and transform into conversational JSONL
for _, row in df.iterrows():
    # Construct the user input text describing weather conditions
    user_prompt = (
        f"Location: {row.get('Location', 'Unknown')}\n"
        f"Temperature Range: {row.get('MinTemp', 'N/A')}°C - {row.get('MaxTemp', 'N/A')}°C\n"
        f"Humidity (3pm): {row.get('Humidity3pm', 'N/A')}%\n"
        f"Pressure (3pm): {row.get('Pressure3pm', 'N/A')} hPa\n"
        f"Wind Speed (3pm): {row.get('WindSpeed3pm', 'N/A')} km/h"
    )
    
    # Determine warning level based on target data
    rain_next_day = str(row.get('RainTomorrow', '')).lower()
    if rain_next_day in ['yes', '1', 'true']:
        warning_status = "CRITICAL: HEAVY RAIN WARNING"
        recommendation = "High likelihood of precipitation. Carry an umbrella and delay flood-prone travel."
    else:
        warning_status = "CLEAR: NO RAIN WARNING"
        recommendation = "Normal conditions expected. No immediate rainfall hazards."

    assistant_response = f"Status: {warning_status}\nAction: {recommendation}"

    # Format into Gemini Supervised Fine-Tuning JSON structure
    jsonl_records.append({
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Evaluate the following weather observation and state if a rainfall warning is needed:\n\n{user_prompt}"}]
            },
            {
                "role": "model",
                "parts": [{"text": assistant_response}]
            }
        ]
    })

# Save to rainfall_training_data.jsonl
with open(jsonl_file_path, "w") as f:
    for record in jsonl_records[:1000]:  # Fine-tune on a subset of 1,000 samples
        f.write(json.dumps(record) + "\n")

print(f"Training dataset saved as '{jsonl_file_path}'")


# ==========================================
# STEP 3: Upload Training File & Fine-Tune Gemini
# ==========================================
print("3. Uploading file and starting tuning job...")

# Upload JSONL training file to Gemini API File store
training_file = client.files.upload(
    file=jsonl_file_path,
    config=types.UploadFileConfig(mime_type="text/plain")
)

# Start fine-tuning job using gemini-2.5-flash
tuning_job = client.tunings.tune(
    base_model="models/gemini-2.5-flash",
    training_data=training_file.name,
    config=types.CreateTuningJobConfig(
        display_name="Rainfall_Warning_Classifier",
        epoch_count=5,
        batch_size=4,
        learning_rate=0.001
    )
)

print(f"Tuning Job Started successfully!")
print(f"Job Name: {tuning_job.name}")
print(f"Model ID: {tuning_job.tuned_model_endpoint}")


# ==========================================
# STEP 4: Query Fine-Tuned Model for Predictions
# ==========================================
# Note: You can query the model once tuning completes (Status = ACTIVE)
def test_weather_warning(tuned_model_id, location, temp_min, temp_max, humidity, pressure, wind_speed):
    test_prompt = (
        f"Evaluate the following weather observation and state if a rainfall warning is needed:\n\n"
        f"Location: {location}\n"
        f"Temperature Range: {temp_min}°C - {temp_max}°C\n"
        f"Humidity (3pm): {humidity}%\n"
        f"Pressure (3pm): {pressure} hPa\n"
        f"Wind Speed (3pm): {wind_speed} km/h"
    )

    response = client.models.generate_content(
        model=tuned_model_id,
        contents=test_prompt
    )
    return response.text

# Example execution call once training is finished:
# print(test_weather_warning(tuning_job.tuned_model_endpoint, "Mumbai", 22.0, 28.5, 92, 998.5, 28))