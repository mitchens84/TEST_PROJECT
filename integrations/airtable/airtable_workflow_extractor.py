#!/usr/bin/env python3
"""
Airtable Workflow Data Extractor
--------------------------------
Extracts workflow data from a specified Airtable base and table,
saving it to a JSON file for visualization.

Usage:
    python workflow_extractor.py --base-id BASE_ID --table-id TABLE_ID [--view-id VIEW_ID] [--output OUTPUT]

Example:
    python workflow_extractor.py --base-id appXJL5GujVVKGBSs --table-id tblMFMc0Ej1VjRVtw --view-id viwVJkaHSNGfv91iC
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
import requests
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


def fetch_and_save_airtable_data(base_id, table_id, view_id, api_key, output_file):
    """
    Fetches data from a specific Airtable view and saves it to a JSON file.
    If view_id is None, fetches all data from the table.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Build the URL
    url = f"https://api.airtable.com/v0/{base_id}/{table_id}"
    params = {}
    if view_id:
        params['view'] = view_id
        print(f"Fetching data from base '{base_id}', table '{table_id}', view '{view_id}'...")
    else:
        print(f"Fetching data from base '{base_id}', table '{table_id}' (no specific view)...")

    # Make the request
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    all_records = response.json().get("records", [])

    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, 'w') as f:
        json.dump(all_records, f, indent=4)
    print(f"Data successfully fetched and saved to {output_file}")


def main():
    api_key = os.environ.get("AIRTABLE_API_KEY")
    if not api_key:
        print("Error: AIRTABLE_API_KEY environment variable not set.")
        return

    # Load configuration from JSON file
    config_file_path = os.path.join(os.path.dirname(__file__), 'airtable_config.json')
    try:
        with open(config_file_path, 'r') as f:
            config = json.load(f)
    except FileNotFoundError:
        print(f"Error: Configuration file not found at {config_file_path}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {config_file_path}")
        return

    extraction_tasks = config.get("extractionTasks")
    if not extraction_tasks:
        print("No extraction tasks found in the configuration file.")
        return

    if not isinstance(extraction_tasks, list):
        print("Error: 'extractionTasks' should be a list in the configuration file.")
        return

    for task in extraction_tasks:
        task_name = task.get("taskName", "Unnamed Task")
        base_id = task.get("baseId")
        table_id = task.get("tableId")
        view_id = task.get("viewId")  # Can be None
        output_file = task.get("outputFile")

        if not all([base_id, table_id, output_file]):
            print(f"Skipping task '{task_name}' due to missing baseId, tableId, or outputFile.")
            continue

        print(f"--- Running Task: {task_name} ---")
        fetch_and_save_airtable_data(base_id, table_id, view_id, api_key, output_file)
        print(f"--- Task: {task_name} Completed ---")


if __name__ == "__main__":
    main()
