from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for reading PDFs
import pandas as pd
import re

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

def extract_table_from_text(text):
    """
    Tries to format extracted text into a table-like structure.
    Assumes data is structured in rows and columns.
    """
    lines = text.split("\n")
    table_data = []
    
    for line in lines:
        row = re.split(r'\s{2,}', line.strip())  # Split by multiple spaces (assuming table format)
        if len(row) > 1:  # Valid table row
            table_data.append(row)
    
    # Convert to pandas DataFrame for better structuring
    if table_data:
        df = pd.DataFrame(table_data)
        return df.to_html(index=False, escape=False)  # Convert to HTML table
    return "<p>No structured table data found in the report.</p>"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        # Read PDF content
        doc = fitz.open(stream=file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text("text") + "\n"

        # Extract tables from text
        extracted_table = extract_table_from_text(text)

        return jsonify({'table_html': extracted_table})

    return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)
